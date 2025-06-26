import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material/dialog";
import { getProperty } from "src/app/utils/app.utils";
import { KiScoreService } from "../../services/ki-score.service";

@Component({
  selector: "app-ki-score-alerts",
  templateUrl: "./ki-score-alerts.component.html",
  styleUrls: ["./ki-score-alerts.component.scss"],
})
export class KiScoreAlertsComponent implements OnInit {
  message: string = "";

  constructor(
    private readonly kiScoreService: KiScoreService,
    public readonly dialogRef: MatDialogRef<KiScoreAlertsComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: any,
  ) {}

  ngOnInit(): void {
    this.message = getProperty(this.data, "message", "");
  }

  cancel() {
    this.dialogRef.close();
  }

  async handleYes() {
    const response = await this.kiScoreService.retryKiScore(this.data);
    this.dialogRef.close(response);
  }
}
