import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-fraud-check-report",
  templateUrl: "./fraud-check-report.component.html",
})
export class FraudCheckReportComponent implements OnInit {
  fraudCheckData: any = {};
  printableHtmlString: SafeHtml;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty("data")) {
        const serializedData = params["data"];
        const data: any = JSON.parse(
          decodeURIComponent(window.atob(serializedData))
        );
        this.fraudCheckData = data;
        const htmlString: string = getProperty(
          this.fraudCheckData,
          "printableReportLink",
          ""
        );
        this.printableHtmlString = this.getHtmlCode(htmlString);
      }
    });
  }

  getHtmlCode(htmlString: string = ""): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }
}
