import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { EncryptDecryptService } from '../shared/encrypt-decrypt/encrypt-decrypt.service';
import {
  PasswordService,
  PasswordResetInitService,
  PasswordResetFinishService,
  PasswordResetInitComponent,
  PasswordResetFinishComponent,
  accountState,
} from '.';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(accountState, { useHash: true }),
  ],
  declarations: [PasswordResetInitComponent, PasswordResetFinishComponent, ForgotPasswordComponent],
  providers: [
    PasswordService,
    PasswordResetInitService,
    PasswordResetFinishService,
    EncryptDecryptService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountModule {}
