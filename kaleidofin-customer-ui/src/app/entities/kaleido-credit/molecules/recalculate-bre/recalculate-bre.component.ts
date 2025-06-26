import { Component, OnInit } from "@angular/core";
import { RecalculateBreService } from "../../services/recalculate-bre/recalculate-bre.service";
import { BusinessRuleEngineService } from "../../services/business-rule-engine/business-rule-engine.service";
import { BreStatusResponse } from "../../services/recalculate-bre/bre.constants";

@Component({
  selector: "app-recalculate-bre",
  templateUrl: "./recalculate-bre.component.html",
  styleUrls: ["./recalculate-bre.component.scss"],
})
export class RecalculateBreComponent implements OnInit {
  progressValue: number = 0;
  decision: string = "FAIL";

  constructor(
    private readonly recalculateBreService: RecalculateBreService,
    private readonly breService: BusinessRuleEngineService
  ) {}

  ngOnInit(): void {
    this.recalculateBreService
      .getProgressCalculated()
      .subscribe((value: number) => {
        this.progressValue = value;
      });
    this.breService
      .getBreResponse()
      .subscribe((response: BreStatusResponse) => {
        this.decision = response?.overallDecision?.toUpperCase() ?? "FAIL";
      });
  }
}
