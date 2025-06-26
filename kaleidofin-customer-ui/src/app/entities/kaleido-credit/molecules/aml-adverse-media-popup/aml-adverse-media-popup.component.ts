import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getProperty } from 'src/app/utils/app.utils';

@Component({
  selector: 'app-aml-adverse-media-popup',
  templateUrl: './aml-adverse-media-popup.component.html',
  styleUrls: ['./aml-adverse-media-popup.component.scss']
})
export class AmlAdverseMediaPopupComponent implements OnInit {
  mediaLinks: Record<string, any>[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: any,
    private readonly dialogRef: MatDialogRef<AmlAdverseMediaPopupComponent>,
    private readonly snackbar: MatSnackBar
) { }

  ngOnInit(): void {
    this.mediaLinks = getProperty(this.data, "mediaLinks", []);
  }

  closePopup(): void {
    this.dialogRef.close();
  }

  openUrl(url: string = null): void {
    if(!url?.length) {
      this.snackbar.open("Invalid URL", "", {
        duration: 1500
      })
      return;
    }
    const targetUrl = new URL(url);
    window.open(targetUrl, "_blank");
  }

}
