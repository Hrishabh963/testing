import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { PrincipalService } from "src/app/core";
import { getProperty } from "src/app/utils/app.utils";
import { MandatoryFieldValidationService } from "../../services/mandatory-field-validation/mandatory-field-validation.service";

@Component({
  selector: "app-select-with-input",
  templateUrl: "./select-with-input.component.html",
})
export class SelectWithInputComponent implements OnInit {
  @Input() dropDownValues: Array<string> = [];
  @Input() dataObj: any = {};
  @Input() label: string = "";
  @Input() isRequired: boolean = false;
  @Input() showToolTip: boolean = false;
  @Input() toolTipLabel: string = null;
  @Input() roles: string[] = [];
  @Input() key: string = null;
  selectFieldFormControl: FormControl = null;
  showInput: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly principalService: PrincipalService,
    private readonly mandatoryFieldService: MandatoryFieldValidationService
  ) {}

  ngOnInit(): void {
    if (!this.selectFieldFormControl) {
      this.selectFieldFormControl = this.fb.control(this.dataObj?.value);
      this.selectFieldFormControl.valueChanges.subscribe((value) => {
        this.dataObj.value = value;
        if (value && this.roles?.length) {
          this.mandatoryFieldService.removeField(this.key);
        }
      });
    }
    if (this.roles?.length) {
      this.isRequired = this.roles.some((role) => {
        return role === this.principalService.getUserInfo().role;
      });
    }
    if (this.isRequired) {
      this.selectFieldFormControl.addValidators(Validators.required);
    }
    this.selectFieldFormControl.markAllAsTouched();
    this.selectFieldFormControl.updateValueAndValidity();
  }

  showInputField(): void {
    const value: string = getProperty(this.dataObj, "value", "");
    if (value === "other") {
      this.dataObj.value = "";
      this.showInput = true;
    } else {
      this.showInput = false;
    }
  }
}
