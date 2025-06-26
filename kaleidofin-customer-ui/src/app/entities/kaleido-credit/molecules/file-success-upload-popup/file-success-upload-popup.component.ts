import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-file-success-upload-popup',
  templateUrl: './file-success-upload-popup.component.html',
  styleUrls: ['./file-success-upload-popup.component.scss']
})
export class FileSuccessUploadPopupComponent {

  constructor(private readonly dialogRef: MatDialogRef<FileSuccessUploadPopupComponent>) { }

  close(): void {
    this.dialogRef.close();
  }

}
