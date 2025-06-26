import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { getProperty } from "src/app/utils/app.utils";
import { DedupeService } from "../../dedupe/dedupe.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DedupeResponseDTO } from "../../dedupe/dedupe.models";
import { CustomMessageDisplayComponent } from "../../shared/custom-message-display/custom-message-display.component";

@Component({
  selector: "app-dedupe-check-popup",
  templateUrl: "./dedupe-check-popup.component.html",
  styleUrls: ["./dedupe-check-popup.component.scss"],
})
export class DedupeCheckPopupComponent implements OnInit {
  title: string = null;
  rejectReason: string = null;
  selectedDedupes: DedupeResponseDTO[];
  type: string;
  customerId: number = null;
  dedupeReferenceType: string = null;
  dedupeReferenceId: number = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly dialogData,
    private readonly dialogRef: MatDialogRef<DedupeCheckPopupComponent>,
    private readonly dedupeService: DedupeService,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.title = getProperty(this.dialogData, "title", null);
    this.selectedDedupes = getProperty(this.dialogData, "selectedDedupes", []);
    this.type = getProperty(this.dialogData, "type", "ACCEPT");
    this.customerId = getProperty(this.dialogData, "customerId", null);
    this.dedupeReferenceType = getProperty(
      this.dialogData,
      "dedupeReferenceType",
      null
    );
    this.dedupeReferenceId = getProperty(
      this.dialogData,
      "dedupeReferenceId",
      null
    );
  }

  reject(): void {
    this.dedupeService.rejectDedupe(this.rejectReason).subscribe(
      () => {
        location.reload();
        this.close();
      },
      (error) => {
        const errorMessage = getProperty(
          error,
          "error?.message",
          "Unexpected Error"
        );
        this.snackbar.open(errorMessage, "close", {
          duration: 3000,
        });
      }
    );
  }

  approve(): void {
    this.dedupeService
      .markDedupe(
        this.customerId,
        this.selectedDedupes,
        true,
        this.dedupeReferenceId,
        this.dedupeReferenceType
      )
      .subscribe({
        next: () => {
          const successDialogRef = this.dialog.open(
            CustomMessageDisplayComponent,
            {
              data: {
                headerText: "Success",
                isSuccessConfirmation: true,
                successText:
                  "Successfully approved. Customer records will be merged/updated",
              },
              width: "33vw",
            }
          );
          successDialogRef.afterClosed().subscribe(() => {
            location.reload();
            this.dialogRef.close();
          });
        },
        error: (error) => {
          const errorMessage = getProperty(
            error,
            "error?.message",
            "Unexpected Error"
          );
          this.snackbar.open(errorMessage, "close", {
            duration: 3000,
          });
        },
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
