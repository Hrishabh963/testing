import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-inactivity-popup",
  templateUrl: "./user-inactivity-popup.component.html",
  styleUrls: ["./user-inactivity-popup.component.scss"],
})
export class UserInactivityPopupComponent {
  constructor(
    private readonly router: Router,
    private readonly dialogRef: MatDialogRef<UserInactivityPopupComponent>
  ) {}

  loginUser() {
    this.router.navigate(["/"]);
    this.dialogRef.close();
  }
}
