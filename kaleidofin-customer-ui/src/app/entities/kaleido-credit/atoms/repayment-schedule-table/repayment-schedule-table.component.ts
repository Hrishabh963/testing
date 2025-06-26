import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { REPAYMENT_SCHEUDLE_MAP, STAGGERED_SCHEDULE_MAP } from './repayment-schedule-table.constants';

@Component({
  selector: "app-repayment-schedule-table",
  templateUrl: "./repayment-schedule-table.component.html",
  styleUrls: ["./repayment-schedule-table.component.scss"],
})
export class RepaymentScheduleTableComponent implements OnInit {
  @Input() paymentSchedule: Array<any> = [];
  @Input() emiType: string = null;
  @Input() enableEdit: boolean = false;
  @Input() finalLoanAmount: number = null;
  @Input() disableEdit: boolean = false;
  @Input() principalAmountException: string = null;
  @Input() repaymentScheduleError: string = null;
  @Input() showTenureError: boolean = false;
  @Output() saveDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkForError: EventEmitter<any> = new EventEmitter<any>();
  tableMap: Array<any> = [];

  ngOnInit(): void {
    this.tableMap = this.emiType?.toLowerCase()
      .includes("non-emi")
      ? STAGGERED_SCHEDULE_MAP
      : REPAYMENT_SCHEUDLE_MAP;
  }
}
