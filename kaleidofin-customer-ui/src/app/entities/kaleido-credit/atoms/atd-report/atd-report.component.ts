import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PdfExportService } from "../../services/pdfexport.service";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-atd-report",
  templateUrl: "./atd-report.component.html",
  styleUrls: ["./atd-report.component.scss", "../reports-styles.scss"],
})
export class AtdReportComponent implements OnInit {
  reportData: any = {};
applicantName: string = null;
  sections: Array<any> = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly pdfExportService: PdfExportService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty("data")) {
        const serializedData = params["data"];
        let data = JSON.parse(decodeURIComponent(window.atob(serializedData)));
        this.reportData = getProperty(data, "response", []);
        this.applicantName = getProperty(data, "applicantName", null);
      }
    });
  }

  downloadPdf(): void {
    const fileName:string = this.applicantName ? `${this.applicantName}_ATD_Sheet` : null;
    this.pdfExportService.downloadCurrentPageAsPdf(fileName);
  }
}
