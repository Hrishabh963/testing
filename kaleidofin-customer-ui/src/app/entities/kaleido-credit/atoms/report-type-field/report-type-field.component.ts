import { Component } from "@angular/core";
import { GenerateReportsService } from "../../services/generate-reports.service";

@Component({
  selector: "app-report-type-field",
  templateUrl: "./report-type-field.component.html",
  styleUrls: ["./report-type-field.component.scss"],
})
export class ReportTypeFieldComponent{  

  constructor(public reportService: GenerateReportsService) {}

}
