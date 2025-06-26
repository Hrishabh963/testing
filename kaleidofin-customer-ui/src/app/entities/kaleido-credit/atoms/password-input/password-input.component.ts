import { Component, Input, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-password-input",
  templateUrl: "./password-input.component.html",
  styleUrls: ["./password-input.component.scss"],
})
export class PasswordInputComponent {
  @Input() myForm: FormGroup;
  @Input() title: string;
  @Input() placeHolder: string;
  @Input() id: string;
  @Input() toolTipValid: boolean;
  @Input() showError: boolean;
  @Input() errorMessage: string = null;
  @Input() showGuidelines: boolean = true;
  @Input() remainingRequirements: Array<string> = []; 
  @Input() showPasswordError: boolean = false;
  @Input() isCurrentPassword: boolean = false;
  @Input() showRequirements: boolean  = false;
  passwordFieldType: string = "password";

  guidelinesVisible: boolean = false;
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger; // Reference to the menu trigger
 

  constructor() {}

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === "password" ? "text" : "password";
  }
  closeMenu() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu(); 
    }
  }
}
