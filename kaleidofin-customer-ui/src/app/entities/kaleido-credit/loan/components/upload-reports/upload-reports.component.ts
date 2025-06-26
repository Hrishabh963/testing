import { Input, Component, OnInit,OnChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { UploadReportPopupComponent } from "./upload-report-popup/upload-report-popup.component";
import { DEFAULT_UPLOAD_REPORT_TITLE, LOAN_STAGE_UPLOAD_VALUE_MAP } from "../../../upload/kcredit-upload.constants";
import { AuthorizationService } from "../../../services/authorization.service";
import { AUTHORITES } from "../../../constants/authorization.constants";

@Component({
  selector: "app-upload-reports",
  templateUrl: "./upload-reports.component.html",
  styleUrls: ["./upload-reports.component.scss"],
})
export class UploadReportsComponent implements OnInit,OnChanges {
  buttonText = "";
  authority={view:false};
  @Input() uploadLoanStage: string = "";

  constructor(
    public readonly dialog: MatDialog, 
    private readonly authorizationService:AuthorizationService
  ) {}
  
  ngOnInit(): void {
    this.buttonText = "Upload Decisioning";
  }
  ngOnChanges() {
    this.authority.view = this.authorizationService.hasAuthorityByStage(AUTHORITES.UPLOADLOANREVIEWREPORT,this.uploadLoanStage)
  }
  openUploadDialog = (): void => {
    const dialogRef = this.dialog.open(UploadReportPopupComponent, {
      minWidth: "45vw",
      maxHeight: "80vh",
      data: {
        reportsRouteUrl: "kcredit/upload",
        uploadLoanStatus: LOAN_STAGE_UPLOAD_VALUE_MAP[this.uploadLoanStage],
        dialogTitle: DEFAULT_UPLOAD_REPORT_TITLE,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log("The dialog was closed");
    });
  };
}
