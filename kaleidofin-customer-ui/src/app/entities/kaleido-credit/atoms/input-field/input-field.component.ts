import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { PrincipalService } from "src/app/core";
import { CustomValidator } from "src/app/shared/validations/custom.validation";
import { getProperty } from "src/app/utils/app.utils";
import { MandatoryFieldValidationService } from "../../services/mandatory-field-validation/mandatory-field-validation.service";

@Component({
  selector: "app-input-field",
  templateUrl: "./input-field.component.html",
})
export class InputFieldComponent implements OnInit, OnChanges {
  @Input() dataObj: any = {};
  @Input() editable: boolean;
  @Input() label: string = "";
  @Input() isRequired: boolean = false;
  @Input() errors: any = {};
  @Input() inputLength: number;
  @Input() disabled: boolean = false;
  @Input() useRegex: boolean = false;
  @Input() customRegex: string = "";
  @Input() errorMessage: string = "Please enter a valid input.";
  @Input() showToolTip: boolean = false;
  @Input() toolTipLabel: string = null;
  @Input() roles: string[] = [];
  @Input() key: string = null;

  inputFormControl: FormControl = new FormControl();

  constructor(
    readonly customValidator: CustomValidator,
    private readonly principalService: PrincipalService,
    private readonly mandatoryValidation: MandatoryFieldValidationService
  ) {}

  ngOnInit(): void {
    if (this.useRegex) {
      this.inputFormControl = new FormControl(
        { value: this.dataObj?.value ?? "", disabled: this.disabled },
        this.customValidator.regexValidator(this.customRegex)
      );
    } else {
      this.inputFormControl = new FormControl({
        value: this.dataObj?.value ?? "",
        disabled: this.disabled,
      });
    }
    this.inputFormControl.valueChanges.subscribe((value) => {
      this.dataObj.value = value;
      if(value && this.roles?.length) {
        this.mandatoryValidation.removeField(this.key);
      }
    });

    if(this.roles?.length) {
      this.isRequired = this.roles.some((role)=> {
        return role === this.principalService.getUserInfo().role;
      });
    }

    if(this.isRequired) {
      this.inputFormControl.addValidators(Validators.required);
    }
    this.inputFormControl.markAllAsTouched();
    this.inputFormControl.updateValueAndValidity();

    if (this.disabled) {
      this.inputFormControl.disable();
    } else {
      this.inputFormControl.enable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const disableChange: SimpleChange = getProperty(changes, "disabled", {});
    if (disableChange?.currentValue) {
      this.inputFormControl.disable();
    } else {
      this.inputFormControl.enable();
    }
  }
}
