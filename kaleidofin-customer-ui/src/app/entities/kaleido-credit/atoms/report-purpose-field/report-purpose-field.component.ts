import { Component } from "@angular/core";
import { MatSelectOption } from "../../loan/constant";
import { GenerateReportsService } from "../../services/generate-reports.service";

@Component({
  selector: "app-report-purpose-field",
  templateUrl: "./report-purpose-field.component.html",
  styleUrls: ["./report-purpose-field.component.scss"],
})
export class ReportPurposeFieldComponent {
  constructor(public reportsService: GenerateReportsService) {}

  updatePurpose(selectedPurpose: MatSelectOption) {
    this.reportsService.setPurpose(selectedPurpose);
  }
}
