import { Component, Input } from "@angular/core";

@Component({
  selector: "app-activity-all",
  templateUrl: "./activity-all.component.html",
  styleUrls: [
    "./activity-all.component.scss",
    "../activity-history/activity-history.component.scss",
  ],
})
export class ActivityAllComponent {
  @Input() loanId: number = null;

  @Input() data: Array<any> = [];

  constructor() {}
}
