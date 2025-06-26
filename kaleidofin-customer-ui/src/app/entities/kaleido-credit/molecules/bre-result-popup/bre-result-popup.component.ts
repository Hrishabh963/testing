import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { BusinessRuleEngineService } from "../../services/business-rule-engine/business-rule-engine.service";
import { BreStatusResponse } from "../../services/recalculate-bre/bre.constants";

@Component({
  selector: "app-bre-result-popup",
  templateUrl: "./bre-result-popup.component.html",
  styleUrls: ["./bre-result-popup.component.scss"],
})
export class BreResultPopupComponent implements OnInit {
  breResult: any = {
    FAIL: {
      icon: "/assets/images/BRE/recalculate-result-fail.svg",
      description: "Please check the BRE report again.",
    },
    DEVIATION: {
      icon: "/assets/images/BRE/recalculate-result-deviation.svg",
      description: "Please approve all the deviations",
    },
  };

  decision: string = "FAIL";

  constructor(
    private readonly dialogRef: MatDialogRef<BreResultPopupComponent>,
    private readonly breService: BusinessRuleEngineService
  ) {}

  ngOnInit(): void {
    this.breService
      .getBreResponse()
      .subscribe((response: BreStatusResponse) => {
        this.decision = response?.overallDecision?.toUpperCase() ?? "FAIL";
      });
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}
