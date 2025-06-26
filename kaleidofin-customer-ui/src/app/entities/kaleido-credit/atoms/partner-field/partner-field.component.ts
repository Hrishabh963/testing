import { Component } from "@angular/core";
import { GenerateReportsService } from "../../services/generate-reports.service";

@Component({
  selector: "app-partner-field",
  templateUrl: "./partner-field.component.html",
  styleUrls: ["./partner-field.component.scss"],
})
export class PartnerFieldComponent {

  constructor(
    public reportService: GenerateReportsService,
  ) {}
 }
