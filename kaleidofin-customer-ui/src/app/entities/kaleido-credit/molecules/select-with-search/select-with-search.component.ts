import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-select-with-search",
  templateUrl: "./select-with-search.component.html",
  styleUrls: ["./select-with-search.component.scss"],
})
export class SelectWithSearchComponent implements OnInit {
  @Input() rejectReasons: Array<any> = [];
  @Input() defaultSelectedReasons: Array<any> = [];
  @Input() placeholder: string = "Category of Reasons";
  @Output() selectedReasonChange: EventEmitter<any> = new EventEmitter<any>();
  selectedReasons = new FormControl([]);

  searchFieldFormControl: FormControl = new FormControl();
  filteredOptions: Array<any> = [];

  ngOnInit(): void {
    this.rejectReasons = this.rejectReasons.map((reason) => {
      if (this.defaultSelectedReasons.includes(reason?.value)) {
        reason["disabled"] = true;
      }
      return reason;
    });
    this.filteredOptions = this.rejectReasons;
    let reasons = this.rejectReasons.filter((reason) =>
      this.defaultSelectedReasons.includes(reason?.value)
    );

    this.selectedReasons.setValue(reasons);

    this.searchFieldFormControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe((value) => {
        this.filteredOptions = this.rejectReasons.filter((reason) => {
          return reason.label.toLowerCase().includes(value.toLowerCase());
        });
      });
  }

  changeReason(): void {
    this.selectedReasonChange.emit(this.selectedReasons.value);
  }

  removeSelection(index: number): void {
    const updatedReasons = this.selectedReasons.value;
    updatedReasons.splice(index, 1);
    this.selectedReasons.setValue(updatedReasons);
    this.changeReason();
  }

  resetFields(): void {
    this.searchFieldFormControl.setValue("");
    this.filteredOptions = [...this.rejectReasons];
  }
}
