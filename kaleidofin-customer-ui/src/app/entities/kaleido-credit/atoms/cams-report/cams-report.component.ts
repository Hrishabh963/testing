import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UI_COMPONENTS } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";
import { UiConfigService } from "../../services/ui-config.service";
import { FileService } from "../../services/files/file.service";
import { PdfExportService } from "../../services/pdfexport.service";

@Component({
  selector: "app-cams-report",
  templateUrl: "./cams-report.component.html",
  styleUrls: ["./cams-report.component.scss"],
})
export class CamsReportComponent implements OnInit {
  reportData: any = {};
  reportTitle: string = "";
  camSheetSections: Array<string> = [];
  customerData: any = {};
  applicantName: string = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly uiConfigService: UiConfigService,
    private readonly fileService: FileService,
    private readonly pdfExportService: PdfExportService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty("data")) {
        const serializedData = params["data"];
        let data = JSON.parse(decodeURIComponent(window.atob(serializedData)));
        this.reportData = data || {};
        this.customerData = getProperty(
          this.reportData,
          "customerRequirementDto.rmVisitReports[0]"
        );
        this.applicantName = getProperty(this.reportData, "applicantName", null);
        this.getUiFields();
        this.updateCustomerData();
      }
    });
  }

  updateCustomerData() {
    let fileId = getProperty(this.customerData, "fileId", null);
    if (fileId) {
      this.fileService
        .getFileURL(fileId)
        .subscribe((url) => (this.customerData["fileUrl"] = url));
    }
  }
  filterValidSections() {
    if (
      !getProperty(
        this.reportData,
        "vehicleLoanInsuranceDetailDtos.length",
        null
      )
    ) {
      this.camSheetSections = this.camSheetSections.filter(
        (section) => section !== "vehicleInsuranceDetails"
      );
    }
  }

  getUiFields(): void {
    this.uiConfigService.getUiConfig(UI_COMPONENTS.LOAN_REVIEW).subscribe(
      (response) => {
        const sectionConfig = this.uiConfigService.getUiConfigurationsBySection(
          response,
          "CAM_SHEET_SECTION",
          true
        );
        this.camSheetSections = getProperty(sectionConfig, "uiFieldsMap", []);
        this.reportTitle = getProperty(
          sectionConfig,
          "reportTitle",
          "CAM Sheet"
        );
        this.filterValidSections();
      },
      (error) => console.error(error)
    );
  }
  downloadPdf() {
    const fileName: string = this.applicantName ? `${this.applicantName}_CAMs_Sheet` : null;
    this.pdfExportService.downloadCurrentPageAsPdf(fileName);
  }
}
