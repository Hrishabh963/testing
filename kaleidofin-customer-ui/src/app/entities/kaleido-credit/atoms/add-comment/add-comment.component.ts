import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getProperty } from "src/app/utils/app.utils";
import { UploadReportPopupComponent } from "../../loan/components/upload-reports/upload-report-popup/upload-report-popup.component";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";
import { LoanActivityService } from "../../services/loan-activity.service";
import { UploadService } from "../../services/upload.service";
import { AuthorizationService } from "../../services/authorization.service";

@Component({
  selector: "app-add-comment",
  templateUrl: "./add-comment.component.html",
  styleUrls: ["./add-comment.component.scss"],
})
export class AddCommentComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() showCancel: boolean = false;

  @Output() reloadComments: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetComment: EventEmitter<any> = new EventEmitter<any>();
  @Input() userName: string = "";
  @Input() comment: string = "";
  @Input() commentId: number = null;
  @Input() editComment: boolean = false;
  validateAddCommentAuthority: boolean = false;

  selectedDocuments: Array<any> = [];
  constructor(
    private readonly loanActivityService: LoanActivityService,
    private readonly snackbar: MatSnackBar,
    private readonly fileUploadService: UploadService,
    private readonly dialog: MatDialog,
    private readonly associateLenderService: AssociateLenderService,
    private readonly authorizationService: AuthorizationService
  ) {}

  ngOnInit(): void {
    this.userName = this.loanActivityService.getInitials(this.userName);
    this.validateAddCommentAuthority =
      this.authorizationService.validateEditAccess();
  }

  receiveFiles(files: Array<any> = []) {
    this.selectedDocuments = files;
  }

  uploadDocuments() {
    const dialogRef = this.dialog.open(UploadReportPopupComponent, {
      minWidth: "45vw",
      maxHeight: "80vh",
      data: {
        reportsRouteUrl: "this.reportsRouteUrl",
        acceptedFileTypes: ["pdf", "doc", "docx", "xls", "xlsx", "csv", "eml"],
        uploadType: "RECEIVE_FILES",
        dialogTitle: "Upload Documents",
        canAllowMultiple: false,
        openByDefault: true,
        receiveFiles: (event) => this.receiveFiles(event),
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
  }
  cancel() {
    this.selectedDocuments = [];
    this.comment = "";
    if (this.showCancel) {
      this.resetComment.emit();
    }
  }
  async addComment() {
    const comment = this.comment?.replace(/[<>'",@#$%^&()*]/g, "");
    if (this.editComment) {
      this.loanActivityService
        .editComment(comment, this.commentId, this.loanId, null, null)
        .subscribe(
          () => this.handleSuccess(false, "updated"),
          (error) => {
            console.error(error);
            this.snackbar.open("Error while Adding Comment", "", {
              duration: 3000,
            });
          }
        );
      return;
    }
    const fileDto: Array<any> = [];
    let canReload: boolean = false;
    if (getProperty(this.selectedDocuments, "length", false)) {
      await this.uploadComments(fileDto);
      canReload = true;
    }
    this.saveComment(fileDto, comment, canReload);
  }

  async uploadComments(fileDto: Array<any> = []) {
    const partnerId = getProperty(
      this.associateLenderService.getLenderData(),
      "partnerId",
      null
    );
    for (let i = 0; i < this.selectedDocuments.length; i++) {
      const file = this.selectedDocuments[i];
      const request = {
        fileName: file.name,
        partnerId,
      };

      const response = await this.fileUploadService
        .createPreSignedS3URL(request)
        .toPromise();

      fileDto.push(response);

      await this.fileUploadService
        .uploadFileBySignedURL(
          getProperty(fileDto[i], "preSignedUrl", ""),
          file
        )
        .toPromise();
    }
  }

  saveComment(
    fileDto: any = [],
    comment: string = this.comment,
    canReload: boolean = false
  ) {
    this.loanActivityService
      .addComment(comment, fileDto, this.loanId)
      .subscribe(
        () => this.handleSuccess(canReload),
        (error) => {
          this.snackbar.open("Error while Adding Comment", "", {
            duration: 3000,
          });
        }
      );
  }

  handleSuccess(canReload: boolean = false, type: string = "added") {
    this.snackbar.open(`Comments ${type} successfully`, "", {
      duration: 3000,
    });
    this.cancel();
    if (canReload) {
      window.location.reload();
    } else {
      this.reloadComments.emit();
    }
  }
}
