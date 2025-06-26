import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-loan-stage-display",
  templateUrl: "./loan-stage-display.component.html",
  styleUrls: ["./loan-stage-display.component.scss"],
})
export class LoanStageDisplayComponent implements OnChanges, OnInit {
  @Input() data: any = [];
  @Input() selectedLoanSubStageIndex: number = null;
  @Output() clickHandler: EventEmitter<any> = new EventEmitter<any>();
  selectedIndex: number = 0;

  ngOnInit(): void {
    this.selectedIndex = this.selectedLoanSubStageIndex || 0;
  } 

  onApplicationStateSelection(status, index) {
    this.selectedIndex = index;
    this.clickHandler.emit({ status, index });
  }
  ngOnChanges(changes: SimpleChanges): void {
    const loanSubStageIndex: SimpleChange = getProperty(changes, 'selectedLoanSubStageIndex', {});
    if(getProperty(loanSubStageIndex,'currentValue',0) !== getProperty(loanSubStageIndex,'previousValue',0)) {
      this.selectedIndex = this.selectedLoanSubStageIndex;
    }
  }
}
