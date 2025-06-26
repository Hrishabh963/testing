import {  Component, Input, OnInit , Output, EventEmitter} from "@angular/core";
import * as _moment from "moment";
const moment = _moment;
import { DashboardService } from "../../entities/dashboard/dashboard.service";

interface Range {
  view: string;
  start: any;
  end: any;
}

interface SelectedDate {
  startDate: string;
  endDate: string;
}

@Component({
  selector: "custom-datepicker",
  templateUrl: "./custom-datepicker.component.html",
  styleUrls: ["./custom-datepicker.scss"]
})
export class CustomDatepickerComponent implements OnInit {
  @Output() datesEventEmitter = new EventEmitter<SelectedDate>();
  @Input() startDateInput: any;
  @Input() endDateInput: any;
  emitDates!: SelectedDate;
  ranges: Range[] = [
    { view: "Last 7 Days", start: moment().subtract(6, "days"), end: moment() },
    {
      view: "Last 30 Days",
      start: moment().subtract(30, "days"),
      end: moment()
    },
    {
      view: "Last 6 Months",
      start: moment().subtract(6, "month"),
      end: moment()
    },
    {
      view: "Last 1 Year",
      start: moment().subtract(12, "month"),
      end: moment()
    }
  ];

  startDate: any;
  endDate: any;
  sD!: Date;
  eD!: Date;
  todayDate: Date = new Date();

  constructor(
    private readonly dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.dashboardService.currentDateRange.subscribe(range => {
      if (range.view === "selected" && range.start && range.end) {
        this.initDates(range);
      } else {
        this.updateDates(this.ranges[0]);
      }
    });
  }

  initDates(e: Range) {
    this.startDate = e.start;
    this.endDate = e.end;
    this.sD = this.startDate.toDate();
    this.eD = this.endDate.toDate();
    this.emitDates = {
      startDate: this.startDate.format("YYYY-MM-DD"),
      endDate: this.endDate.format("YYYY-MM-DD")
    };
    this.datesEventEmitter.emit(this.emitDates);
  }

  updateDates(e: Range) {
    console.log(e);
    this.startDate = e.start;
    this.endDate = e.end;
    this.sD = this.startDate.toDate();
    this.eD = this.endDate.toDate();
    this.addStartDateEvent();
  }

  updateStartDate(e: Date) {
    this.sD = e;
  }

  updateEndDate(e: Date) {
    this.eD = e;
  }

  apply() {
    this.startDate = moment(this.sD);
    this.endDate = moment(this.eD);
    this.addStartDateEvent();
  }

  cancel() {
    this.sD = this.startDate.toDate();
    this.eD = this.endDate.toDate();
  }

  addStartDateEvent() {
    this.emitDates = {
      startDate: this.startDate.format("YYYY-MM-DD"),
      endDate: this.endDate.format("YYYY-MM-DD")
    };
    const r: Range = {
      view: "selected",
      start: this.startDate,
      end: this.endDate
    };
    this.dashboardService.changeDate(r);
  }
}
