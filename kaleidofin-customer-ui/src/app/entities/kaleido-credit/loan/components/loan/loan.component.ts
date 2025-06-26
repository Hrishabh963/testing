import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { get } from "lodash";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { BusinessRuleEngineService } from "../../../services/business-rule-engine/business-rule-engine.service";

@Component({
  selector: "jhi-loan",
  templateUrl: "./loan.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class LoanComponent implements OnInit, OnChanges {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Input() cbReport: any;
  @Input() breNeeded: boolean = false;
  cbScore: string = "--";
  breDecision: string = null;

  constructor(private readonly breService: BusinessRuleEngineService) {}

  ngOnInit() {
    this.breService
      .getBreResponse()
      .subscribe(
        (breResponse) =>
          (this.breDecision = get(breResponse, "overallDecision", "") || "")
      );
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!get(changes, "cbReport.firstChange", false)) {
      let report = get(changes, "cbReport.currentValue", null);
      if (report) {
        this.cbScore = get(report, "cbScoreErs", "--");
      }
    }
  }

  fetchBreDecision() : string {
    let decision: string;
    switch (this.breDecision.toLowerCase()) {
      case "pass":
        decision = "Pass";
        break;
      case "fail": 
        decision = "Fail";
        break;
      case "deviation":
        decision = "Deviation";
        break;
      default: 
        decision = "--"
      break;
    }
    return decision;
  }

}
