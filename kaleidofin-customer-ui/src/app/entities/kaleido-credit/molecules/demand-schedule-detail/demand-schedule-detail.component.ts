import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { set } from "lodash";
import { UiFields } from "src/app/constants/ui-config";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-demand-schedule-detail",
  templateUrl: "./demand-schedule-detail.component.html",
  styleUrls: ["./demand-schedule-detail.component.scss"],
})
export class DemandScheduleDetailComponent implements OnInit, OnChanges {
  @Input() uiFieldsMap: Array<any> = [];
  @Input() demandSchedule: UiFields = {};
  @Input() enableEdit: boolean = false;

  @Output() showTenureError: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  tenureFrequency: number = null;
  emiFrequency: number = null;
  irr: number = null;

  tenureFormControl: FormControl = new FormControl();
  emiFormControl: FormControl = new FormControl();
  irrFormControl: FormControl = new FormControl();

  ngOnInit(): void {
    this.tenureFrequency = getProperty(
      this.demandSchedule,
      "tenure.value",
      null
    );
    this.emiFrequency = getProperty(
      this.demandSchedule,
      "emiFrequency.value",
      null
    );
    this.tenureFrequency = getProperty(
      this.demandSchedule,
      "tenure.value",
      null
    );
    this.irr = getProperty(this.demandSchedule, "irr.value", null);
    this.tenureFormControl = new FormControl(this.tenureFrequency);
    this.tenureFormControl.valueChanges.subscribe((value: number) => {
      this.showTenureError.emit(
        value !== this.tenureFrequency ||
          this.emiFormControl.value !== this.emiFrequency ||
          this.irrFormControl.value !== this.irr
      );
      set(this.demandSchedule, "tenure.value", value);
    });
    this.emiFormControl = new FormControl(this.emiFrequency);
    this.emiFormControl.valueChanges.subscribe((value: number) => {
      this.showTenureError.emit(
        value !== this.emiFrequency ||
          this.tenureFormControl.value !== this.tenureFrequency ||
          this.irrFormControl.value !== this.irr
      );
      set(this.demandSchedule, "emiFrequency.value", value);
    });
    this.irrFormControl = new FormControl(this.irr);
    this.irrFormControl.valueChanges.subscribe((value) => {
      this.showTenureError.emit(
        value !== this.irr ||
          this.emiFormControl.value !== this.emiFrequency ||
          this.tenureFormControl.value !== this.tenureFrequency
      );
      set(this.demandSchedule, "irr.value", value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const demandScheduleChanges: SimpleChange = getProperty(
      changes,
      "demandSchedule",
      {}
    );
    if (
      demandScheduleChanges.currentValue !== demandScheduleChanges.previousValue
    ) {
      this.tenureFrequency = getProperty(
        this.demandSchedule,
        "tenure.value",
        null
      );
      this.tenureFormControl.setValue(this.tenureFrequency);
      this.emiFrequency = getProperty(
        this.demandSchedule,
        "emiFrequency.value",
        null
      );
      this.emiFormControl.setValue(this.emiFrequency);
      this.irr = getProperty(this.demandSchedule, "irr.value", null);
      this.irrFormControl.setValue(this.irr);
    }
  }
}
