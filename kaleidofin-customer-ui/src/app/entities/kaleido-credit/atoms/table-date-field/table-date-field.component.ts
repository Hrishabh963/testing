import { DatePipe } from "@angular/common";
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
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { get } from "lodash";
import moment from "moment";
import { Subscription } from "rxjs";

@Component({
  selector: "app-repayment-table-date-field",
  templateUrl: "./table-date-field.component.html",
  styleUrls: ["./table-date-field.component.scss"],
})
export class TableDateFieldComponent implements OnInit, OnChanges, OnDestroy {
  @Input() valueObj: any = {};
  @Input() key: string = "";
  @Input() disableEdit: boolean = false;
  @Output() saveDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkForError: EventEmitter<boolean> = new EventEmitter<boolean>();
  dateFormControl: FormControl = new FormControl();
  private subscriptionRef: Subscription = new Subscription();

  minDate: Date = null;

  constructor(private readonly datePipe: DatePipe) {}

  ngOnInit(): void {
    this.minDate = new Date();
    this.dateFormControl = new FormControl("", [
      (control: FormControl) => this.minDateValidator(control),
      (control: FormControl) => this.maxDateValidator(control),
    ]);
    this.toggleFormControlState();
    this.subscriptionRef = this.dateFormControl.valueChanges.subscribe(()=> {
      if(this.dateFormControl.errors) {
        this.checkForError.emit(true);
      }
      else {
        this.checkForError.emit(false);
      }      
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const disableEditChange: SimpleChange = get(changes, "disableEdit", null);
    if (disableEditChange && !disableEditChange.isFirstChange()) {
      this.toggleFormControlState();
    }
  }

  ngOnDestroy(): void {
    if(this.subscriptionRef) {
      this.subscriptionRef.unsubscribe();
    }
  }

  toggleFormControlState(): void {
    if (this.disableEdit) {
      this.dateFormControl.disable({ emitEvent: false });
    } else {
      this.dateFormControl.enable({ emitEvent: false });
    }
  }

  minDateValidator(control: FormControl): ValidationErrors | null {
    const selectedDate = control.value;
    const currentDate = new Date();
    if (selectedDate && selectedDate <= currentDate) {
      return { min: true };
    }
    return null;
  }

  maxDateValidator(control: FormControl): ValidationErrors | null {
    const selectedDate = control.value;
    const maxDate: Date = moment().add(6, "months").toDate();
    if (selectedDate && selectedDate > maxDate) {
      return { max: true };
    }
    return null;
  }

  changeDate(event: MatDatepickerInputEvent<Date>): void {
    const dateObj: Date = event.value;
    this.valueObj[this.key] = this.datePipe.transform(dateObj, "yyyy-MM-dd");
    if (!this.dateFormControl?.errors) {
      this.saveDetails.emit();
    }
  }

  getDate(): Date | null {
    const dateString: string = this.valueObj[this.key];
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }
}
