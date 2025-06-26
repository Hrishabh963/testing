import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: "app-table-header-multi-select",
  templateUrl: "./table-header-multi-select.component.html",
})
export class TableHeaderMultiSelectComponent {
  @Input() column: any = {};

  all: any = { value: "All" };

  allSelected: boolean = false;
  selectAllFormControl: FormControl = new FormControl();
  selectedValues: Array<any> = [];

  @Output() onFilterChange: EventEmitter<any> = new EventEmitter<any>();

  handleChange(event: MatCheckboxChange): void {
    const checked: boolean = event.checked;
    this.allSelected = checked;

    if (this.allSelected) {
      this.selectedValues = [...(this.column?.options ?? [])];
      this.selectAllFormControl.setValue(this.selectedValues);
    } else {
      this.selectAllFormControl.reset();
      this.selectedValues = [];
    }
    this.onChange();
  }

  onChange(): void {
    let selectedOptions: Array<any> = this.selectedValues.map(
      (option) => option?.value
    );

    if (selectedOptions.length === this.column?.options?.length) {
      this.allSelected = true;
    } else {
      this.allSelected = false;
    }
    this.onFilterChange.emit({ value: selectedOptions });
  }
}
