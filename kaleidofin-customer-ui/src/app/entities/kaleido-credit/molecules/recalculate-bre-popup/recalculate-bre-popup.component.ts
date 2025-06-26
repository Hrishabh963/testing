import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { RecalculateBreService } from "../../services/recalculate-bre/recalculate-bre.service";

@Component({
  selector: "app-recalculate-bre-popup",
  templateUrl: "./recalculate-bre-popup.component.html",
  styleUrls: ["./recalculate-bre-popup.component.scss"],
})
export class RecalculateBrePopupComponent implements OnInit {
  progressValue: number = 0;

  constructor(
    private readonly dialogRef: MatDialogRef<RecalculateBrePopupComponent>,
    private readonly recalculateBreService: RecalculateBreService
  ) {}

  ngOnInit(): void {
    this.recalculateBreService.startInterval();
    this.recalculateBreService
      .getProgressCalculated()
      .subscribe((value: number) => {
        this.progressValue = value;
        if (this.progressValue === 100) {
          setTimeout(() => this.closePopup(), 600);
        }
      });
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}
