import { Component, Input } from "@angular/core";

@Component({
  selector: "app-mfi-cam-report",
  templateUrl: "./mfi-cam-report.component.html"
})
export class MfiCamReportComponent {
  @Input() reportData: any = {};
}
