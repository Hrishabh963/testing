import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-alerts',
  templateUrl: './confirmation-alerts.component.html',
  styleUrls: ['./confirmation-alerts.component.scss']
})
export class ConfirmationAlertsComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationAlertsComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
