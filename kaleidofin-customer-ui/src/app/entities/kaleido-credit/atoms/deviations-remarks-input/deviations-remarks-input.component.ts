import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, ValidationErrors } from "@angular/forms";
import { ApproveDeviation } from "../../molecules/deviations-table/deviations.constants";

@Component({
  selector: "app-deviations-remarks-input",
  templateUrl: "./deviations-remarks-input.component.html",
  styleUrls: ["./deviations-remarks-input.component.scss"],
})
export class DeviationsRemarksInputComponent implements OnInit {
  textAreaFormControl: FormControl = new FormControl();

  @Input() approval: ApproveDeviation = {};

  @Output() closeMenu: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveRemarks: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.textAreaFormControl = new FormControl(this.approval?.remarks ?? "", [
      (control: FormControl)=> this.checkInputLength(control)
    ]);
    this.textAreaFormControl.valueChanges.subscribe(()=> {
      this.textAreaFormControl.updateValueAndValidity({emitEvent: false});
    })
  }

  checkInputLength(control: FormControl): ValidationErrors | null {
    const value: string = control.value;
    if(value && value.length > 250) {
      return {
        minLength: true
      }
    }
    return null;
  }

  close(): void {
    this.closeMenu.emit();
  }

  save(): void {
    this.saveRemarks.emit(this.textAreaFormControl.value);
  }
}
