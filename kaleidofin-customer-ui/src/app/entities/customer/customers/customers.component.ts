import {  Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { CustomerService } from "../customer.service";
import { Customer } from "../customer.model";
import { Router, ActivatedRoute } from "@angular/router";
import { DashboardService } from "../../dashboard/dashboard.service";
import {
  BranchDTO,
  CenterDTO,
  SearchDTO,
  BranchAndCenterDTO,
} from "../branch.model";
import { PrincipalService } from "src/app/core";
import get from "lodash/get";
import { TopNavService } from "src/app/layouts/navbar/topnav.service";
export interface Chip {
  name: string;
  count: number;
}

@Component({
  selector: "ig-app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
  isOpen = false;
  branchDropdownList: BranchDTO[] = [];
  branchSelectedItems: BranchDTO[] = [];
  centerDropdownList: CenterDTO[] = [];
  centerSelectedItems: CenterDTO[] = [];
  dropdownSettings: any = {};
  dropdownSettings2: any = {};
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  public pageSize = 10;
  public currentPage = 0;
  public resultsLength = 0;
  startDate: string = "";
  endDate: string = "";
  sortBy: string = "";
  order: string = "";
  search: SearchDTO = new SearchDTO([], []);
  displayedColumns: string[] = [
    "cs.createdDate",
    "product",
    "c.name",
    "agent",
    "branch",
    "payment",
    "action",
  ];
  data: Customer[] = [];
  branchCenterDTO: BranchAndCenterDTO;
  branchList: BranchDTO[] = [];
  centerList: CenterDTO[] = [];
  branchChanged = false;
  centerChanged = false;
  countBranches = 0;
  countCenters = 0;
  chipList: Chip[] = [];

  constructor(
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly dashboardService: DashboardService,
    private readonly principal: PrincipalService,
    private readonly route: ActivatedRoute,
    private readonly topNavService: TopNavService
  ) {}

  ngOnInit() {
    this.sortBy = "cs.createdDate";
    this.order = "desc";
    this.principal.identity().then((account) => {
      this.dashboardService.sendMessage("shownav");
      this.topNavService.topNav$.next("customers");
    });
    this.route.data.subscribe((response: any) => {
      console.log("api response");
      console.log(response.resolveData);
      this.branchList = response.resolveData.branchDTOList;
      this.centerList = response.resolveData.centerDTOList;
      this.branchDropdownList = this.branchList;
    });
    this.branchSelectedItems = [];
    this.centerSelectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      itemsShowLimit: 1,
      allowSearchFilter: true,
      enableCheckAll: false,
      limitSelection: 5,
    };
    this.dropdownSettings2 = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      itemsShowLimit: 1,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: "No Branch Selected",
      enableCheckAll: false,
      limitSelection: 10,
    };
  }

  getDateRange(e: any) {
    this.startDate = e.startDate;
    this.endDate = e.endDate;
    this.search = new SearchDTO();
    this.getData();
  }

  getData() {
    this.getCustomersList(
      this.startDate,
      this.endDate,
      this.pageSize,
      this.currentPage,
      this.sortBy,
      this.order
    );
  }

  getCustomersList(
    startDate: string,
    endDate: string,
    pageSize: number,
    currentPage: number,
    sortBy: string,
    order: string
  ) {
    this.customerService
      .getCustomersList(
        startDate,
        endDate,
        pageSize,
        currentPage,
        sortBy,
        order,
        this.search
      )
      .subscribe((response: any) => {
        this.data = response.content;
        this.resultsLength = response.totalElements;
      });
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getData();
  }

  sortData() {
    if (!this.sort.active || this.sort.direction === "") {
      this.sortBy = "cs.createdDate";
      this.order = "desc";
      this.getData();
      return;
    }
    this.sortBy = this.sort.active;
    this.order = this.sort.direction;
    this.getData();
  }

  navigateTo(row: any) {
    this.router.navigate(["customerDetail/" + row.customerId]);
  }

  onChanged() {
    this.branchChanged = true;
  }

  add(s: string, c: number) {
    const _remove = this.chipList.find(
      (chip) => chip.name.valueOf() === s.valueOf()
    );
    if (_remove) {
      const index = this.chipList.indexOf(_remove);
      this.chipList.splice(index, 1);
    }
    const _add: Chip = { name: s, count: c };
    this.chipList.push(_add);
  }

  remove(chip: Chip) {
    const index = this.chipList.indexOf(chip);
    if (index >= 0) {
      if (this.chipList[index].name.valueOf() === "Branches".valueOf()) {
        this.search.branchId = [];
        this.search.centerId = [];
        this.branchSelectedItems = [];
        this.centerSelectedItems = [];
        this.centerDropdownList = [];
      }
      if (this.chipList[index].name.valueOf() === "Centers".valueOf()) {
        this.search.centerId = [];
        this.centerSelectedItems = [];
      }
      this.chipList.splice(index, 1);
      this.getData();
    }
  }

  onBranchItemSelect(itemSelected: any) {
    this.centerDropdownList = [];
    this.branchChanged = true;
    const centers = this.centerList.filter(
      (item) => item.branchId === itemSelected.id
    );
    this.centerDropdownList = [...this.centerDropdownList, ...centers];
  }

  onCenterItemSelect(item: any, type: string = "") {
    this.centerChanged = true;
  }
  onBranchSelectAll(items: any) {
    this.branchChanged = true;
  }
  onCenterSelectAll(items: any) {
    this.centerChanged = true;
  }
  cancelFilter() {
    this.isOpen = false;
  }

  applyFilter() {
    this.countBranches = this.branchSelectedItems.length;
    this.countCenters = this.centerSelectedItems.length;

    const updateSelection = (
      changed: boolean,
      count: number,
      type: string,
      items: any[],
      searchField: string
    ) => {
      if (changed) {
        if (count) {
          this.add(type, count);
        }
        const ids = items.map((item) => get(item, "id", 0));
        this.search[searchField] = ids;
      }
    };

    updateSelection(
      this.branchChanged,
      this.countBranches,
      "Branches",
      this.branchSelectedItems,
      "branchId"
    );
    updateSelection(
      this.centerChanged,
      this.countCenters,
      "Centers",
      this.centerSelectedItems,
      "centerId"
    );

    if (this.branchChanged || this.centerChanged) {
      this.getData();
    }

    this.isOpen = false;
  }

  clear() {
    this.isOpen = false;
    this.centerDropdownList = [];
    this.centerSelectedItems = [];
    this.branchSelectedItems = [];
    this.branchChanged = false;
    this.centerChanged = false;
    this.chipList = [];
    this.search.centerId = [];
    this.search.branchId = [];
    this.getData();
  }
}
