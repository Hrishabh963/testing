import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { set } from "lodash";
import { debounceTime } from "rxjs/operators";
import { getProperty } from "src/app/utils/app.utils";
import { LoanApplicationSearchFilterService } from "../../services/loan-application-search-filter.service";
import { ReviewStateManagementService } from "../../services/review-state-management.service";

@Component({
  selector: "app-multi-filter",
  templateUrl: "./multi-filter.component.html",
  styleUrls: ["./multi-filter.component.scss"],
})
export class MultiFilterComponent implements OnInit {
  @Input() requiredFilters: Array<any> = [];
  @Output() toggleDrawer: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateFilter: EventEmitter<any> = new EventEmitter<any>();
  searchFieldFormControl: FormControl = new FormControl();
  filterData: Object = {};
  filterOptions: Array<any> = [];
  currentOptions: Array<any> = [];
  selectedFilter: string = null;
  selectedFilterIndex: number = null;
  allChecked: boolean = false;
  checkDefault: boolean = false;

  constructor(
    private readonly loanAppFilterService: LoanApplicationSearchFilterService,
    private readonly reviewStateService: ReviewStateManagementService
  ) {}

  ngOnInit(): void {
    this.loanAppFilterService.filterData.subscribe((data) => {
      this.filterData = { ...data };
      this.selectedFilter =
        this.requiredFilters.length > 0 ? this.requiredFilters[0]?.value : "";
      this.setFilterValue(this.selectedFilter, 0);
    });

    this.searchFieldFormControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value: string) => {
        const selectedFilterOptions = getProperty(
          this.filterData,
          this.selectedFilter,
          []
        );
        this.currentOptions = selectedFilterOptions.filter((option) => {
          const label: string = getProperty(option, "label", "");
          return label.toLowerCase().includes(value.toLowerCase());
        });

        const selectedFilter = this.requiredFilters[this.selectedFilterIndex];
        set(selectedFilter, "count", 0);
        selectedFilter.count = this.currentOptions.filter(
          (option) => option.checked
        ).length;

        this.filterData[this.selectedFilter].forEach((option) => {
          option.checked = this.currentOptions.some(
            (currOption) =>
              currOption.label === option.label && currOption.checked
          );
        });

        this.allChecked =
          this.currentOptions.length > 0 &&
          this.currentOptions.every((option) => option.checked);
      });
      this.updateCount();
  }

  updateCount(): void {
    const reviewStateFilterData = this.reviewStateService.$filterData;
    this.requiredFilters.forEach((filter)=> {
      filter.count = reviewStateFilterData?.[filter?.value]?.length ?? 0;
    })
  }

  setFilterValue(filterValue: string, index: number): void {
    if (!filterValue) return;

    this.selectedFilter = filterValue;
    this.currentOptions = getProperty(this.filterData, this.selectedFilter, []);
    if (
      this.reviewStateService?.$filterData?.[this.selectedFilter] &&
      this.reviewStateService?.$filterData?.[this.selectedFilter]?.length > 0
    ) {
      this.currentOptions.forEach((option) => {
        option.checked = this.reviewStateService.$filterData[
          this.selectedFilter
        ]?.includes(
          this.selectedFilter === "ASSIGNEE" ? option?.label : option?.value
        );
      });
    }

    if (index !== this.selectedFilterIndex) {
      this.allChecked = this.currentOptions.every((option) => option.checked);
    }
    this.selectedFilterIndex = index;
    this.searchFieldFormControl.setValue("");
  }

  checkOption(event, filter: object, isDefault: boolean = false) {
    const checked: boolean = !!event?.checked;
    set(filter, "checked", checked);
    const selectedFilter = this.requiredFilters[this.selectedFilterIndex];
    if (selectedFilter) {
      selectedFilter.count = (selectedFilter.count || 0) + (checked ? 1 : -1);
    }
    this.allChecked = this.currentOptions.every((option) => option.checked);
    if (isDefault) {
      set(
        this.requiredFilters[this.selectedFilterIndex],
        "defaultCheck",
        checked
      );
    }
  }

  

  clearAllSelected(): void {
    this.allChecked = false;
    this.checkDefault = false;

    Object.keys(this.filterData).forEach((filter: any) => {
      const hasDefault: any = this.requiredFilters.find(
        (filterObject) => filterObject.value === filter
      );
      if (hasDefault?.enableDefaultValue) {
        hasDefault["defaultCheck"] = false;
      }
      this.filterData[filter].forEach((option) => {
        option.checked = false;
      });
    });

    this.requiredFilters = this.requiredFilters.map((filter) => {
      return { ...filter, count: 0 };
    });
  }

  toggleAll(event): void {
    this.allChecked = !this.allChecked;
    const selectedFilter = this.requiredFilters[this.selectedFilterIndex];
    this.currentOptions.forEach((option) => {
      set(option, "checked", event?.checked);
    });
    selectedFilter.count = this.currentOptions.filter(
      (option) => option.checked
    ).length;
  }

  applyFilter(): void {
    const changedValues: any[] = [];
    for (const [key, options] of Object.entries(this.filterData)) {
      const values: Array<any> = options
        .filter((option) => option.checked)
        .map((option) => (key === "ASSIGNEE" ? option.label : option.value));

      const requiredFilter = this.requiredFilters.find(
        (filter) => filter.value === key
      );
      const defaultCheck: boolean = getProperty(
        requiredFilter,
        "defaultCheck",
        false
      );
      if (defaultCheck) {
        values.push(requiredFilter.defaultValue.value);
      }
      requiredFilter.count = values?.length;
      const propertyKey = getProperty(requiredFilter, "propertyKey", "");
      this.reviewStateService.setFilterData(key, values);
      changedValues.push({ type: propertyKey, value: values.join(",") });
    }
    this.updateFilter.emit(changedValues);
    this.toggleDrawer.emit();
    this.loanAppFilterService.filterData.next(this.filterData);
  }
}
