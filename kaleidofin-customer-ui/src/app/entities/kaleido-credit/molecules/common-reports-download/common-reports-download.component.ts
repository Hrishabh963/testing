import { Component, Input, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { CommonReportsDownloadService } from "../../services/common-reports-download.service";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";
import { UiConfigService } from "../../services/ui-config.service";
import { getProperty } from "src/app/utils/app.utils";
import { Subscription } from "rxjs";

@Component({
  selector: "app-common-reports-download",
  templateUrl: "./common-reports-download.component.html",
})
export class CommonReportsDownloadComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() fromEntry: boolean = false;
  @Input() loanId: number = null;
  @Input() downloadCams: boolean = false;

  reports: Array<Object> = [
    { viewValue: "ATD Sheet", value: "atd" },
    { viewValue: "FI Report", value: "fiReport" },
  ];

  fiReportData: any = {};
  private uiConfigSubscriber: Subscription = new Subscription();
  camsReport: any = { viewValue: "CAM Sheet", value: "cams" };

  constructor(
    private readonly reportService: CommonReportsDownloadService,
    private readonly associateLenderService: AssociateLenderService,
    private readonly uiConfigService: UiConfigService
  ) {}

  ngOnInit(): void {
    this.uiConfigSubscriber = this.uiConfigService.getUiConfigData().subscribe(
      (data) => {
        this.fiReportData = getProperty(data, "FI_DETAILS");
      }
    );
  }

  ngOnDestroy(): void {
    if (this.uiConfigSubscriber) {
      this.uiConfigSubscriber?.unsubscribe();
    }
  }

  ngOnChanges(): void {
    if (this.downloadCams === true) {
      this.reports.unshift(this.camsReport);
    }
    const lenderCode: string = this.associateLenderService.getLenderCode();

    if (lenderCode.toLowerCase() === "dcbmfi") {
      this.reports = this.reports.filter((report: any) => {
        return report.value === "cams";
      });
    }
  }

  openReport(reportType: string = "") {
    switch (reportType) {
      case "atd":
        this.reportService.openATDReport(this.loanId, "atd-report");
        break;
      case "cams":
        this.reportService.openCamsSheetReport(this.loanId, "cams-report");
        break;
      case "fiReport":
        this.reportService.openFiReport("fi-report", this.fiReportData);
        break;
      default:
        break;
    }
  }
}
