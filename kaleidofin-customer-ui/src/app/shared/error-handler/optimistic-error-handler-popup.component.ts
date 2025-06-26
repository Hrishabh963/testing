import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PrincipalService } from 'src/app/core';

@Component({
  selector: 'ig-optimistic-error-handler-popup',
  templateUrl: 'optimistic-error-handler-popup.component.html',
})
export class OptimisticErrorHandlerDialogComponent {
  constructor(
    public readonly dialogRef: MatDialogRef<OptimisticErrorHandlerDialogComponent>,
    public readonly principal: PrincipalService,
    private readonly router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef.disableClose = true;
  }

  closeDialog(): void {
    this.dialogRef.close();
    this.router.navigateByUrl('/dashboard/home');
  }

  retry() {
    if (!this.principal.isAuthenticated()) {
      this.router.navigateByUrl('login');
    } else {
      this.router.navigateByUrl('/dashboard/home');
    }
    this.dialogRef.close();
  }
}
