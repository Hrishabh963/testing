import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss']
})
export class UserChangePasswordComponent {

  @Input() passwordFormGroup: FormGroup;
  @Input() failedRequirement: string = null;

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

}
