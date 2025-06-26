import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import {
  ApproveDeviation,
  DEVIATION_TABLE_DATA,
  DeviationDTO,
  DeviationTypeAndValue,
} from "./deviations.constants";
import { AUTHORITES } from "../../constants/authorization.constants";
import { AuthorizationService } from "../../services/authorization.service";
import { get } from "lodash";
import { UploadReportPopupComponent } from "../../loan/components/upload-reports/upload-report-popup/upload-report-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { DeviationDocumentsComponent } from "../../organisms/deviation-documents/deviation-documents.component";
import { UploadService } from "../../services/upload.service";
import { MatMenuTrigger } from "@angular/material/menu";
import { ConfirmationPopupComponent } from "../confirmation-popup/confirmation-popup.component";
import { FileSuccessUploadPopupComponent } from "../file-success-upload-popup/file-success-upload-popup.component";
import { BusinessRuleEngineService } from "../../services/business-rule-engine/business-rule-engine.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getProperty, titleCase } from "src/app/utils/app.utils";
import { UiFieldsDto } from "src/app/constants/ui-config";

@Component({
  selector: "app-deviations-table",
  templateUrl: "./deviations-table.component.html",
  styleUrls: ["./deviations-table.component.scss"],
})
export class DeviationsTableComponent implements OnInit {
  @Input() loanId: number = null;
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
  deviations: Array<DeviationDTO> = [];
  tableData: Array<any> = DEVIATION_TABLE_DATA;

  currentDeviations: Array<DeviationDTO> = [];
  checkAll: boolean = false;
  checkedDeviations: Array<any> = [];
  authority: { approve: boolean } = { approve: false };
  nullValueError: string = "System is unable to calculate due to missing data";

  constructor(
    private readonly breService: BusinessRuleEngineService,
    private readonly snackbar: MatSnackBar,
    private readonly authorizationService: AuthorizationService,
    private readonly dialog: MatDialog,
    private readonly uploadService: UploadService
  ) {}

  closeMenu(): void {
    this.menuTrigger.closeMenu();
  }

  ngOnInit(): void {
    this.breService.deviations.subscribe((deviations) => {
      this.deviations = deviations;
      this.splitDeviations();
    });
    this.authority.approve =
      this.authorizationService.validateEditAccess() &&
      this.authorizationService.hasAuthority(AUTHORITES.APPROVE_DEVIATIONS);
  }
  
  splitDeviations(): void {
    this.currentDeviations =
      this.deviations.length > 5
        ? this.deviations.slice(0, 5)
        : this.deviations;
  }

  checkAllDeviations() {
    this.checkAll = !this.checkAll;
    if (this.checkAll) {
      this.checkedDeviations = this.currentDeviations.filter((deviation) => {
        const approveDeviations = getProperty(
          deviation,
          "approveDeviations",
          []
        );
        return (
          getProperty(
            approveDeviations,
            "[0].approveDeviation",
            ""
          ).toLowerCase() === "pending" &&
          get(approveDeviations, "[0].enableDeviationApproval", false)
        );
      });
    } else {
      this.checkedDeviations = [];
    }
  }

  selectDeviation(checkEvent: MatCheckboxChange, deviation: any = {}): void {
    if (checkEvent.checked) {
      this.checkedDeviations.push(deviation);
    } else {
      this.checkedDeviations = this.checkedDeviations.filter(
        (item) => item.deviationId !== deviation.deviationId
      );
    }
  }

  showMoreDeviations(): void {
    this.currentDeviations = this.deviations;
  }

  saveRemarks(remarks: string, approval: ApproveDeviation): void {
    this.breService.saveDeviationComments(approval?.deviationId, remarks).subscribe(()=> {
      approval.remarks = remarks;
    },
  (error)=> {
    const errorMessage = getProperty(error?.error, "message", "Error saving comment");
    this.snackbar.open(errorMessage, 'Close', {
      duration: 3500
    })
  })
  }

  handleDeviationDecision(
    deviations: Array<any>,
    decision: string,
    hasHigherAuthority: boolean = false,
    deviationAuthority: string = "Credit Analyst"
  ): void {
    const changeDecision = (approveDecision: any) => ({
      ...approveDecision,
      approveDeviation: decision,
    });

    const deviationDecision = deviations.map((deviation) => ({
      ...deviation,
      approveDeviations: getProperty(deviation, "approveDeviations", []).map(
        changeDecision
      ),
    }));

    const payload: any = {
      breDeviationsSectionList: deviationDecision,
      loanId: this.loanId,
    };
    if (hasHigherAuthority) {
      const style: string = decision === "Approved" ? "approve" : "reject";
      const text: string = `Are you sure you want to ${style} the deviation for 
    ${deviationAuthority}?`;
      const confirmText = `Yes, ${titleCase(style)}`;
      const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        data: {
          popupStyle: style,
          title: "Confirmation",
          popupText: text,
          confirmButtonText: confirmText,
          enableTextField: true,
          textFieldLabel: "Type remarks",
        },
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        const forceClosed: boolean = get(data, "forceClosed", false);
        if (forceClosed) {
          return;
        }
        const approvalComment: string = getProperty(
          data,
          "approverComment",
          null
        );
        if (approvalComment) {
          this.setComment(deviationDecision, approvalComment);
        }
        this.uploadDeviations(deviationDecision, payload);
      });
    } else {
      this.uploadDeviations(deviationDecision, payload);
    }
  }

  setComment(deviations: Array<DeviationDTO>, comment: string): void {
    const addComment = (approval: ApproveDeviation): void => {
      approval.approverComment = comment;
    };

    deviations.forEach((deviation) => {
      deviation.approveDeviations.forEach(addComment);
    });
  }

  uploadDeviations(deviations: Array<DeviationDTO>, payload: any): void {
    this.breService.postDeviationRemarks(payload).subscribe(
      (res: any) => {
        const sectionDTO: UiFieldsDto = getProperty(res, "sectionDto", {});
        this.deviations = getProperty(
          sectionDTO,
          "subSections[0].fields.breDeviationsSectionList.value",
          []
        );
        this.splitDeviations();
      },
      (error) => {
        console.error(error);
        this.snackbar.open(
          getProperty(
            error,
            "error.message",
            "Error while remarking deviations"
          ),
          "",
          { duration: 3000 }
        );
      }
    );
  }

  uploadDocument(approval: ApproveDeviation, deviation: DeviationDTO): void {
    if (approval?.approveDeviation?.toLowerCase() !== "pending") {
      if (approval?.deviationFilesDto?.length === 0) {
        return;
      }
      this.dialog.open(DeviationDocumentsComponent, {
        minWidth: "45vw",
        maxHeight: "80vh",
        data: {
          deviationDocumentDto: approval?.deviationFilesDto ?? [],
        },
      });
      return;
    }
    if (!approval?.selectedDocuments) {
      approval["selectedDocuments"] = [];
    }
    const uploadAuthorities = deviation?.documentsAuthorities ?? [];
    const hasDocumentUploadAuthority: boolean = uploadAuthorities.some((auth) =>
      this.authorizationService.hasAuthority(auth)
    );
    // TODO: Hrishabh - do update the below condition to align for All Lenders [KCPL , DCB & DCB-MFI]
    if (hasDocumentUploadAuthority || approval?.enableDeviationApproval) {
      const dialogRef = this.dialog.open(UploadReportPopupComponent, {
        minWidth: "45vw",
        data: {
          reportsRouteUrl: "this.reportsRouteUrl",
          acceptedFileTypes: [
            "pdf",
            "doc",
            "docx",
            "xls",
            "xlsx",
            "csv",
            "eml",
            "jpeg",
            "jpg",
          ],
          uploadType: "RECEIVE_FILES",
          dialogTitle: "Upload Documents",
          canAllowMultiple: true,
          receiveFiles: (event) => this.receiveFiles(event, approval),
          removeDocuments: (event) =>
            this.removeUploadedDocument(event, approval),
          selectedDocuments: approval?.selectedDocuments,
          existingDocuments: approval?.deviationFilesDto ?? [],
          openByDefault: false,
        },
      });
      dialogRef.afterClosed().subscribe((data: string) => {
        if (data?.toLowerCase() === "cancel") {
          approval.selectedDocuments = [];
        }
      });
    }
  }

  removeUploadedDocument(documentId: number, approval: ApproveDeviation): void {
    if (documentId) {
      approval.deviationFilesDto = [
        ...approval.deviationFilesDto.filter((file) => {
          return file?.id !== documentId;
        }),
      ];
    }
  }

  async receiveFiles(
    documents: Array<File>,
    approval: ApproveDeviation
  ): Promise<void> {
    await this.uploadService.uploadFilesToS3(
      documents,
      "DeviationRemarkDocument",
      approval?.deviationId
    );
    const dialogRef = this.dialog.open(FileSuccessUploadPopupComponent, {
      panelClass: "custom-panel-class",
    });
     dialogRef.afterClosed().subscribe(()=> {
      this.breService.fetchDeviations(this.loanId);
    });
  }

  getCalculatedNameOrValues(
    nameAndValue: DeviationTypeAndValue,
    isValue: boolean = false
  ): Array<string> {
    const calculatedValues = nameAndValue?.calculatedVariablesList ?? [];
    const result: Array<string> = calculatedValues.map(
      (calculatedNameAndValues) => {
        if (isValue) {
          return calculatedNameAndValues?.value;
        }
        return calculatedNameAndValues?.name;
      }
    );
    return result;
  }

  checkCommentAuthority(): boolean {
    return this.authorizationService.hasAuthority(AUTHORITES.SAVE_DEVIATION_COMMENT);
  }

}
