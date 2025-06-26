import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { get } from "lodash";

@Component({
  selector: "app-custom-toast-message",
  templateUrl: "./custom-toast-message.component.html",
  styleUrls: ["./custom-toast-message.component.scss"],
})
export class CustomToastMessageComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CustomToastMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.dialogRef.close();
      }, get(this.data,'duration',2000));
    });
  }
}
