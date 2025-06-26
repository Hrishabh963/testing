import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-loan-stage-breadcrumbs",
  templateUrl: "./loan-stage-breadcrumbs.component.html",
  styleUrls: ["./loan-stage-breadcrumbs.component.scss"],
})
export class LoanStageBreadcrumbsComponent {
  @Input() data: Array<any> = [];
  @Output() clickHandler: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedIndex: number = 0;

  onApplicationStateSelection(status, index) {
    this.clickHandler.emit({ status, index });
  }
}
