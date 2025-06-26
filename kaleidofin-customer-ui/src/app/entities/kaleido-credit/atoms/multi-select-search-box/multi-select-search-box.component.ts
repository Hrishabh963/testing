import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { getProperty } from "src/app/utils/app.utils";
import {
  LoanApplicationSearchFilterService,
} from "../../services/loan-application-search-filter.service";
import { ReviewStateManagementService } from "../../services/review-state-management.service";

@Component({
  selector: "app-multi-select-search-box",
  templateUrl: "./multi-select-search-box.component.html",
  styleUrls: ["./multi-select-search-box.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class MultiSelectSearchBoxComponent implements OnInit {
  @Input() menuKey: string = "";
  @Input() data: any = {};
  @Input() searchFieldFormControl: FormControl = new FormControl();

  @ViewChild(MatSelect) matSelect: MatSelect;
  @Output() submitHandler: EventEmitter<any> = new EventEmitter<any>();
  menus: Array<any> = [];

  filterData: any = {};

  selectedItems: Array<any> = [];
  form: FormGroup;
  sortedMenus: Array<any> = [];

  constructor(
    private readonly loanAppFilterService: LoanApplicationSearchFilterService,
    private readonly reviewState: ReviewStateManagementService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      [this.data?.propertyKey]: new FormControl([]),
    });
    this.loanAppFilterService.filterData.subscribe((data) => {
      this.filterData = { ...data };
      this.menus = data[this.menuKey];
      const selectedFitlerValue: Array<string> = this.reviewState.$filterData[this.menuKey];
      this.menus.forEach((filterValue: any) => {
        const isAssignee = this.menuKey === "ASSIGNEE";
        filterValue.checked = selectedFitlerValue?.includes(
          isAssignee ? filterValue?.label : filterValue?.value
        );
      });
      this.selectedItems = this.menus.filter((option) => option?.checked);
    });
    this.sortedMenus = [...this.menus];
    this.searchFieldFormControl.valueChanges.subscribe((value) => {
      this.sortedMenus = this.menus.filter((menu) => {
        return menu.label.toLowerCase().includes(value.toLowerCase());
      });
    });
  }

  onSelectMenuOpen(isOpen: boolean): void {
    if (!isOpen) {
      this.onSubmit();
      const selectedLabels = new Set(
        this.selectedItems.map((item) => item.label)
      );

      this.menus.forEach((option) => {
        option.checked = selectedLabels.has(option.label);
      });

      this.filterData[this.menuKey] = this.menus;

      this.reviewState.setFilterData(this.menuKey, [...selectedLabels]);

      this.loanAppFilterService.filterData.next(this.filterData);
    }
    this.sortedMenus = [...this.menus];
  }

  onSubmit() {
    this.submitHandler.emit({
      value: this.selectedItems
        .map((item) => {
          // To Be Removed or Refactored - START
          if (getProperty(this.data, "value", "") === "ASSIGNEE") {
            if (
              getProperty(this.data, "enableDefaultValue", false) &&
              getProperty(item, "label", "") ===
                this.loanAppFilterService.FILTERS.ASSIGNEE.defaultValue.label
            ) {
              return this.loanAppFilterService.FILTERS.ASSIGNEE.defaultValue.value;
            }
            return getProperty(item, "label", "");
          }
          // To Be Removed or Refactored - END
          return getProperty(item, "value", "");
        })
        .join(","),
    });
    if (this.matSelect) {
      this.matSelect.close();
    }
  }
}
