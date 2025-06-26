import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { PrincipalService } from "src/app/core";
import { MandatoryFieldValidationService } from "../../services/mandatory-field-validation/mandatory-field-validation.service";

@Component({
  selector: "app-select-field",
  templateUrl: "./select-field.component.html",
  styleUrls: ["./select-field.component.scss"],
})
export class SelectFieldComponent implements OnInit {
  @Input() dataObj: any = {};
  @Input() label: string = "";
  @Input() dropDownValues: Array<string> = [];
  @Input() isRequired: boolean = false;
  @Input() showSearchBox: boolean = false;
  @Input() selectFieldFormControl: FormControl | null = null;
  @Input() showToolTip: boolean = false;
  @Input() toolTipLabel: string = null;
  @Input() disableDefault: boolean = false;
  @Input() roles: string[] = [];
  @Input() key: string = null;

  @Output() emitSelection: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private readonly fb: FormBuilder,
    private readonly principalService: PrincipalService,
    private readonly mandatoryFieldService: MandatoryFieldValidationService
  ) {}

  filteredValues: Array<string> = [];
  searchFieldFormControl: FormControl = new FormControl();

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
    this.emitSelection.emit(this.dataObj?.value);
    this.filteredValues = [...this.dropDownValues];
    this.searchFieldFormControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.filteredValues = this.dropDownValues.filter((reason) => {
          return reason.toLowerCase().includes(value.toLowerCase());
        });
      });
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

  handelSelection(): void {
    this.emitSelection.emit(this.dataObj?.value);
  }
}
