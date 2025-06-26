import { Component, Input } from "@angular/core";
import { FIELD_MAPS } from "../cams.report.constants";

@Component({
  selector: "app-eligibility-calculation",
  templateUrl: "./eligibility-calculation.component.html",
  styleUrls: [
    "../cams-report.component.scss"
  ],
})
export class EligibilityCalculationComponent {
  @Input() index: number = null;
  @Input() reportData: any = {};
  finalIncomeMap = {
    title: "c. Final Income & EMI Obligation",
    tableMap: FIELD_MAPS.finalIncome,
  };
  otherIncomeSources = {
    title: "b. Other Sources of Income",
    tableMap: FIELD_MAPS.otherIncomeSources,
  };

  agriculturalIncome = {
    title: "a. Total Agricultural Income",
    tableMap: FIELD_MAPS.agriculturalIncome,
  };
}
