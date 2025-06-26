import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

@Component({
  selector: "app-mandate-date-filter",
  templateUrl: "./mandate-date-filter.component.html",
  styleUrls: ["./mandate-date-filter.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MandateDateFilterComponent implements OnDestroy {
  startDate: Date;
  endDate: Date;

  startDateValue: string = null;
  endDateValue: string = null;

  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.resetDate();
  }

  resetState() {
    this.startDate = null;
    this.endDate = null;
    this.startDateValue = null;
    this.endDateValue = null;
  }
  ngOnDestroy(): void {
    if (this.startDate !== null || this.endDate !== null) {
      this.resetState();
      this.onSearch.emit({ startDate: this.startDate, endDate: this.endDate });
    }
  }

  resetDate(): void {
    this.resetState();
    this.onSearch.emit({ startDate: this.startDate, endDate: this.endDate });
  }

  searchByDate() {
    this.onSearch.emit({
      startDate: this.startDateValue,
      endDate: this.endDateValue,
    });
  }

  onSelectDate(
    event: MatDatepickerInputEvent<Date>,
    dateType: "start" | "end"
  ) {
    const selectedDate = event.value;
    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");

      if (dateType === "start") {
        this.startDate = selectedDate;
        this.startDateValue = `${year}-${month}-${day}`;
      } else {
        this.endDate = selectedDate;
        this.endDateValue = `${year}-${month}-${day}`;
      }
    }
  }
}
