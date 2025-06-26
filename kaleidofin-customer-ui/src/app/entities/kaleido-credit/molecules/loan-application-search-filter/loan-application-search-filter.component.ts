import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";
import { MatSelectOption } from "../../loan/constant";
import { LoanApplicationSearchFilterService } from "../../services/loan-application-search-filter.service";

@Component({
  selector: "app-loan-application-search-filter",
  templateUrl: "./loan-application-search-filter.component.html",
  styleUrls: ["./loan-application-search-filter.component.scss"],
})
export class LoanApplicationSearchFilterComponent implements OnInit {
  @Input() requiredFilters: Array<string> = [];
  @Input() showMoreFilter: boolean = false;
  @Output() updateFilter = new EventEmitter<any>();
  @Output() openMoreFilters = new EventEmitter<any>();

  filters: Array<any> = this.requiredFilters;
  filterData: Array<MatSelectOption> = [];

  constructor(
    private readonly loanAppFilterService: LoanApplicationSearchFilterService
  ) {}

  ngOnInit(): void {
    this.loanAppFilterService
      .fetchFilterData(this.requiredFilters.map((filter) => filter["value"]))
      .subscribe(
        (response) => {
          this.filterData = response;
          this.loanAppFilterService.filterData.next(this.filterData);
          if(this.showMoreFilter) {
            this.requiredFilters = this.requiredFilters.slice(0,1);
          }
        },
        (error) => console.error(error)
      );      
  }

  onFilterChange(event: any = {}, filterType: string = "") {
    const key = getProperty(filterType, "propertyKey", {});
    const value = getProperty(event, "value", "");
    this.updateFilter.emit([{ type: key, value }]);
  }

}
