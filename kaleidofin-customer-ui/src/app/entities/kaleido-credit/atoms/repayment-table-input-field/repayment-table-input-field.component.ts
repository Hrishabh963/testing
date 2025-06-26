import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { FormControl, ValidationErrors } from "@angular/forms";
import { get, set } from "lodash";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-repayment-table-input-field",
  templateUrl: "./repayment-table-input-field.component.html",
  styleUrls: ["./repayment-table-input-field.component.scss"],
})
export class RepaymentTableInputFieldComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() valueObj: any = {};
  @Input() key: string = "";
  @Input() finalLoanAmount: number = null;
  @Input() disableEdit: boolean = false;
  @Output() saveDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkForError: EventEmitter<any> = new EventEmitter<any>();

  interestAmount: number = null;
  openingBalance: number = null;
  inputFormControl: FormControl = new FormControl();
  private readonly $destroy: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.inputFormControl = new FormControl(this.valueObj?.[this.key] ?? "", [
      (control: FormControl) => this.checkForErrors(control),
    ]);
    this.subscribeToFormChange();
    this.toggleFormControlState();
    this.interestAmount = getProperty(this.valueObj, "interestAmount", null);
    this.openingBalance = getProperty(this.valueObj, "openingPrinciple", null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const disableEditChange: SimpleChange = get(changes, "disableEdit", null);
    if (disableEditChange && !disableEditChange.isFirstChange()) {
      this.toggleFormControlState();
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  subscribeToFormChange(): void {
    this.inputFormControl.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        if (this.inputFormControl.errors) {
          this.checkForError.emit(true);
        } else {
          this.checkForError.emit(false);
        }
      });

    this.inputFormControl.valueChanges
      .pipe(debounceTime(2000), takeUntil(this.$destroy))
      .subscribe(() => {
        if (!this.inputFormControl.errors) {
          this.saveDetails.emit();
        }
      });
  }

  toggleFormControlState(): void {
    if (this.disableEdit) {
      this.inputFormControl.disable({ emitEvent: false });
    } else {
      this.inputFormControl.enable({ emitEvent: false });
    }
  }

  checkForErrors(control: FormControl): ValidationErrors | null {
    const value: number = control.value;
    const errors: ValidationErrors = {};
    if (value > this.openingBalance) {
      errors["emiGreaterThanBalance"] = true;
    }
    if (value <= this.interestAmount) {
      errors["emiLessThanOrEqualToInterest"] = true;
    }
    if (value > this.finalLoanAmount) {
      errors["emiGreaterThanLoanAmount"] = true;
    }
    return Object.keys(errors).length > 0 ? errors : null;
  }

  checkInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let regex = /^\d*(\.\d{0,2})?$/;
    if (!regex.test(input.value)) {
      input.value = input.value.slice(0, input.value.length - 1);
      this.inputFormControl.setValue(input.value, { emitEvent: false });
    }
    const currentValue: number = this.inputFormControl.value;
    if (!this.inputFormControl.errors) {
      set(this.valueObj, this.key, currentValue);
    }
  }
}
