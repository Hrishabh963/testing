import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { PrincipalService } from "src/app/core";
import { getProperty } from "src/app/utils/app.utils";
import { MandatoryFieldValidationService } from "../../services/mandatory-field-validation/mandatory-field-validation.service";

@Component({
  selector: "app-date-field",
  templateUrl: "./date-field.component.html",
})
export class DateFieldComponent implements OnInit, OnChanges {
  @Input() dataObj: any = {};
  @Input() editable: boolean;
  @Input() label: string = "";
  @Input() isRequired: boolean = false;
  @Input() showToolTip: boolean = false;
  @Input() toolTipLabel: string = null;
  @Input() metadata = {};
  @Input() fields = {};
  @Input() roles: string[] = [];
  @Input() key: string = null;
  @Output() triggerUpdate: EventEmitter<any> = new EventEmitter<any>();

  dateFormField: FormControl = null;

  validations: Array<string> = [];
  minDate: Date;
  maxDate: Date;
  initialDate: Date;

  constructor(
    private readonly datePipe: DatePipe,
    private readonly fb: FormBuilder,
    private readonly principal: PrincipalService,
    private readonly mandatoryFieldService: MandatoryFieldValidationService 
  ) {}

  ngOnInit(): void {
    this.dateFormField = this.fb.control(this.dataObj?.value ?? null);
    this.initialDate = new Date();
    this.validations = getProperty(this.metadata, "validationType", []);
    this.validations.forEach((validation) =>
      this.updateValidations(validation)
    );
    if (this.roles?.length) {
      this.isRequired = this.roles.some((role) => {
        return role === this.principal.getUserInfo().role;
      });
    }
    if (this.isRequired) {
      this.dateFormField.addValidators(Validators.required);
    }
    this.dateFormField.markAllAsTouched();
    this.dateFormField.updateValueAndValidity();
  }

  ngOnChanges(): void {
    this.validations.forEach((validation) =>
      this.updateValidations(validation)
    );
  }
  updateValidations(validation: string = "") {
    let dependableDateKey = "";
    let dependableDateValue = "";
    switch (validation) {
      case "MIN_CURRENT_DATE":
        this.minDate = this.initialDate;
        break;
      case "MAX_CURRENT_DATE":
        this.maxDate = new Date();
        break;
      case "DEPENDABLE_DATES_MAX":
        dependableDateKey = getProperty(this.metadata, "dependableDate", null);
        if (dependableDateKey) {
          dependableDateValue = getProperty(
            this.fields,
            `${dependableDateKey}.value`,
            null
          );
          if (dependableDateValue) {
            this.maxDate = new Date(dependableDateValue);
          } else {
            this.maxDate = new Date();
          }
        }
        break;
      case "DEPENDABLE_DATE_RESET":
        dependableDateKey = getProperty(this.metadata, "dependableDate", null);
        if (dependableDateKey) {
          dependableDateValue = getProperty(
            this.fields,
            `${dependableDateKey}.value`,
            null
          );
          const currentValue = new Date(this.dataObj?.value);
          const dependentValue = new Date(
            this.fields[dependableDateKey]?.value
          );

          this.fields[dependableDateKey].error =
            currentValue < dependentValue
              ? "Start Date cannot exceed end date"
              : null;
        }
        break;
      default:
        break;
    }
  }
  edit(date: any = {}, key: string = "", dataObj: any = {}): void {
    if (date["value"]) {
      const newDate: Date = new Date(date["value"]);
      const dateString = this.datePipe.transform(newDate, "yyyy-MM-dd");
      dataObj[key] = dateString;
      this.dateFormField.setValue(date["value"]);
      this.dateFormField.updateValueAndValidity();
      this.validations.forEach((validation) =>
        this.updateValidations(validation)
      );
      this.triggerUpdate.emit(this.fields);
      if(this.roles?.length) {
        this.mandatoryFieldService.removeField(key);
      }
    }
  }

  getDate(dataObj: any = {}): Date | null {
    if (dataObj.value) {
      const date = new Date(dataObj.value);
      return date;
    }
    return null;
  }
}
