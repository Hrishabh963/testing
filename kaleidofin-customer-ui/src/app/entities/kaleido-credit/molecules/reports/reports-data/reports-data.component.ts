import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { get, isEmpty } from "lodash";
import { BehaviorSubject } from "rxjs";
import { getProperty } from "src/app/utils/app.utils";
import { ReportsDataUtilsService } from "src/app/utils/reports-data-utils.service";
import { Partner } from "../../../models/partner.model";
import { AssociateLenderService } from "../../../services/associate-lender/associate-lender.service";
@Component({
  selector: "app-reports-data",
  templateUrl: "./reports-data.component.html",
  styleUrls: ["./reports-data.component.scss"],
})
export class ReportsDataComponent implements OnInit {
  @Input() config: BehaviorSubject<any> = undefined;
  @Input() tableData: Array<any>;
  @Input() totalItems: number;
  @Input() page: any = "";
  @Input() itemsPerPage: any;
  @Output() loadPage = new EventEmitter<any>();
  @Input() links: any;

  internalReports: any = [];
  externalReports: any = [];
  partners: Partner[] = [];
  constructor(
    private readonly lenderService: AssociateLenderService,
    private readonly dataUtils:ReportsDataUtilsService
  ) {}

  ngOnInit(): void {
    this.lenderService.getPartnersLinked().subscribe(
      (partners: Partner[]) => {
        console.log(partners);
        this.partners = partners;
      },
      (error) => console.error(error)
    );
    this.config.subscribe((uiConfig) => {
      this.internalReports = get(uiConfig, "internalReportTypes", []);
      this.externalReports = get(uiConfig, "externalReportTypes", []);
    });
  }

  getReportType(reportData: any): string {
    const reportType = getProperty(reportData, "taskDetail.type", "");
    if (reportType) {
      const reportSelectionObject = [
        ...this.internalReports,
        ...this.externalReports,
      ].find((report) => reportType === report.value);
      return getProperty(reportSelectionObject, "reportTableValue", "---");
    }
    return "---";
  }

  getPartner(reportData: any) {
    const additionalData: any = JSON.parse(
      getProperty(reportData, "taskDetail.additionalData")
    );
    const partnerIds = getProperty(additionalData, "partnerId", []);
    if (!isEmpty(partnerIds)) {
      let partners = partnerIds.map((partnerId) =>
        this.partners.find((partner) => partner.id === partnerId)
      );
      return partners.map((data) => data.name).join(",");
    }
    return "---";
  }
  
  loadDataByPage(pageNumber: any) {
    this.loadPage.emit(pageNumber);
  }
}
