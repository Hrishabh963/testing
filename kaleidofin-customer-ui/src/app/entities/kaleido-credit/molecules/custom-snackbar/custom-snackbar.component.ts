import { Component, Inject, OnInit } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";
import { getProperty } from "src/app/utils/app.utils";

const successImg = `assets/images/common/upload-success.svg`;
const failureImg = `assets/images/common/mdi_close-circle.svg`;
@Component({
  selector: "app-custom-snackbar",
  templateUrl: "./custom-snackbar.component.html",
  styleUrls: ["./custom-snackbar.component.scss"],
})
export class CustomSnackbarComponent implements OnInit {
  message: string = null;
  style: string = null;
  constructor(@Inject(MAT_SNACK_BAR_DATA) private readonly data) {}

  ngOnInit(): void {
    this.message = getProperty(this.data, "message", null);
    this.style = getProperty(this.data, "type", null);
  }

  getImg(): string | null {
    if (!this.style) {
      return null;
    }
    if (this.style === "success") {
      return successImg;
    }
    return failureImg;
  }

  getStyle(): string {
    if (!this.style) {
      return "";
    }
    if (this.style === "success") {
      return "success-snackbar";
    }
    return "failure-snackbar";
  }
}
