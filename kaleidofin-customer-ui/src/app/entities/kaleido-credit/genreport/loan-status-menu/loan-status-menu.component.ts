import { Input, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { LOAN_APPLICATION_STATUS } from "../../loan/constant";

@Component({
  selector: "app-loan-status-menu",
  templateUrl: "./loan-status-menu.component.html",
  styleUrls: ["./loan-status-menu.component.scss"],
})
export class LoanStatusMenuComponent implements OnInit {
  @Input() statusMenus = LOAN_APPLICATION_STATUS;
  @Input() selectedMenu: string[] = [];
  selectedStatus: string[] = [];

  @Output() updateSelectedStatus = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.statusMenus.forEach((menu) => {
      menu.subStatus.forEach((submenu) => (submenu["isChecked"] = false));
    });
  }

  onSubmenuSelection(event: any, submenu: any, menu: any) {
    event.stopPropagation();
    this.updateStatus(submenu, menu);
  }

  handleCheckboxClick(event: any, submenu: any, menu: any) {
    event.stopBubbling();
    this.updateStatus(submenu, menu);
  }
  updateStatus(submenu: any, menu: any) {
    submenu.isChecked = !submenu.isChecked;
    let status = menu.appendStatusTitle
      ? `${menu.viewValue}-${submenu.viewValue}`
      : submenu.viewValue;
    if (submenu.isChecked) {
      // Add the item to the selectedItems array
      this.selectedStatus.push(status);
      this.selectedMenu.push(submenu);
    } else {
      // Remove the item from the selectedItems array
      const index = this.selectedStatus.indexOf(status);
      if (index !== -1) {
        this.selectedStatus.splice(index, 1);
        this.selectedMenu.splice(index, 1);
      }
    }

    this.updateSelectedStatus.emit(this.selectedMenu);
  }
  get selectedItemsString(): string {
    return this.selectedStatus.join(", ");
  }
}
