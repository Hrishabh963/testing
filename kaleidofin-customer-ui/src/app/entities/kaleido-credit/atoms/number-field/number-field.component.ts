import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { PrincipalService } from "src/app/core";
import { MandatoryFieldValidationService } from "../../services/mandatory-field-validation/mandatory-field-validation.service";

@Component({
  selector: "app-number-field",
  templateUrl: "./number-field.component.html",
})
export class NumberFieldComponent implements OnInit {
  @Input() dataObj: any = {};
  @Input() editable: boolean;
  @Input() label: string = "";
  @Input() inputLength: number = 10;
  @Input() isRequired: boolean = false;
  @Input() showToolTip: boolean = false;
  @Input() toolTipLabel: string = null;
  @Input() formControl: FormControl = null;
  @Input() roles: string[] = [];
  @Input() key: string = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly principalService: PrincipalService,
    private readonly mandatoryFieldService: MandatoryFieldValidationService
  ) {}

  ngOnInit(): void {
    if (!this.formControl) {
      this.formControl = this.fb.control(this.dataObj?.value ?? null);
    }
    if (this.roles?.length) {
      this.isRequired = this.roles.some((role) => {
        return role === this.principalService.getUserInfo().role;
      });
    }
    if (this.isRequired) {
      this.formControl.setValidators(Validators.required);
    }
    this.formControl.markAllAsTouched();
    this.formControl.updateValueAndValidity();
    this.formControl?.valueChanges.subscribe((value) => {
      let regex: RegExp;
      if (!this.inputLength) {
        regex = /^\d*(\.\d{0,2})?$/;
      } else {
        regex = new RegExp(`^\\d{0,${this.inputLength}}(\\.\\d{0,2})?$`);
      }

      if (!regex.test(value)) {
        value = value.slice(0, value.length - 1);
      }
      this.dataObj.value = value;
      this.formControl.setValue(value, {
        emitEvent: false,
      });
      if(value && this.roles?.length) {
        this.mandatoryFieldService.removeField(this.key);
      }
    });
  }
}
