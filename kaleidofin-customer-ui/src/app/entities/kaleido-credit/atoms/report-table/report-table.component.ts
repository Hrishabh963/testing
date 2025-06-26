import { Component, Input } from "@angular/core";

@Component({
  selector: "app-report-table",
  templateUrl: "./report-table.component.html",
  styleUrls: ["../reports-styles.scss"],
})
export class ReportTableComponent {
  @Input() reportData: Array<any> = [];
}
