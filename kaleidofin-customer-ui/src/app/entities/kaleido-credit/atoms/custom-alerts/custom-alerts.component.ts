import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getProperty } from 'src/app/utils/app.utils';

@Component({
  selector: 'app-custom-alerts',
  templateUrl: './custom-alerts.component.html',
  styleUrls: ['./custom-alerts.component.scss']
})
export class CustomAlertsComponent implements OnInit {
  closeDialog: boolean = false;
  enableReports: boolean = false;
  errors: boolean = false;
  description:string = "";
  title:string = "";
  constructor(
    public readonly dialogRef: MatDialogRef<CustomAlertsComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly router: Router
  ) {}

  ngOnInit() {
    let dialogRef = getProperty(this.data, "dialogRef", null);
    this.description = getProperty(this.data, "description", '');
    this.errors = getProperty(this.data, "isError", false);
    this.title = getProperty(this.data, "title", "Confirmation");
    if (dialogRef) {
      dialogRef.close(true);
    }
  }

  proceed(): void {
    let routeUrl = getProperty(this.data, "reportsRouteUrl", "");
    if (routeUrl) {
      this.router.navigate([routeUrl]);
    }
    this.dialogRef.close('reload');
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
