import { Component, Input } from "@angular/core";

@Component({
  selector: "app-activity-history",
  templateUrl: "./activity-history.component.html",
  styleUrls: ["./activity-history.component.scss"],
})
export class ActivityHistoryComponent {
  @Input() data: any = {};
  constructor() {}
}
