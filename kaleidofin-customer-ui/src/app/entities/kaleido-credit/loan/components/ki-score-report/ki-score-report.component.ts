import { Component, OnInit } from "@angular/core";
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

const acceptIcon = "assets/images/common/success-check-circle-outlined.svg";
const rejectIcon = "assets/images/common/mdi_close-circle.svg";

@Component({
  selector: "app-ki-score-report",
  templateUrl: "./ki-score-report.component.html",
  styleUrls: ["./ki-score-report.component.scss"],
})
export class KiScoreReportComponent implements OnInit {
  toggleReport: boolean = false;
  tableData: any = [];
  ruleData: any = {};
  actionIcon: SafeResourceUrl = undefined;
  kiScoreData: any = {};
  loanApplicationId: string = "";
  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly route: ActivatedRoute
  ) {
    // Set the path of the SVG image file
    // Generate a safe URL for the SVG image file
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Check if the 'data' query parameter exists
      if (params.hasOwnProperty("data")) {
        // Get the serialized data from the query parameter
        const serializedData = params["data"];
        let data = JSON.parse(decodeURIComponent(window.atob(serializedData)));
        this.kiScoreData = data;
        this.tableData = data?.kiScoreReport?.featureSummaries;
        this.ruleData = data?.kiScoreReport?.ruleSummaries;
      }
    });
  }

  fetchDecisionIcon(decision = "") {
    let icon = rejectIcon;
    if (decision) {
      icon = decision.toLowerCase().includes("pass") ? acceptIcon : rejectIcon;
    }
    return icon;
  }
  getDecisionClass(decision: any = "") {
    if (decision instanceof Array) {
      decision = decision[0];
    }
    decision = decision ? decision.toLowerCase() : "";
    switch (decision) {
      case "pass":
      case "accept":
        return "pass";
      case "fail":
      case "yes":
        return "fail";
      default:
        return "";
    }
  }
  checkCurrency(featureName = "") {
    return featureName?.toLowerCase().includes("amount");
  }

  formatCodeSnippet(code: string): SafeHtml {
    const formattedCode = code
      .replace(/ /g, "&nbsp;")
      .replace(/\t/g, "&nbsp;")
      .replace(/\n/g, "<br>");

    return this.sanitizer.bypassSecurityTrustHtml(formattedCode);
  }
  getCutOffValue(decision: any = "") {
    return ["ncd", "ncv", "ncs"].includes(decision) ? "" : decision;
  }
}
