import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { getProperty } from 'src/app/utils/app.utils';

@Component({
  selector: 'app-login-success-snackbar',
  templateUrl: './custom-success-snackbar.html',
  styleUrls: ['./custom-success-snackbar.scss']
})
export class CustomSuccessSnackBar implements OnInit {
  message: string = null;
  constructor(@Inject(MAT_SNACK_BAR_DATA) private readonly data) { }

  ngOnInit(): void {
    this.message = getProperty(this.data, "message", null);
  }

}
