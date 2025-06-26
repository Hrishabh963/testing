import { Component, OnInit } from "@angular/core";
import { GenerateReportsService } from "../../services/generate-reports.service";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";

@Component({
  selector: "app-loan-type-field",
  templateUrl: "./loan-type-field.component.html",
  styleUrls: ["./loan-type-field.component.scss"],
})
export class LoanTypeFieldComponent implements OnInit {
  loanTypes: string[] = [];
  constructor(
    public readonly reportService: GenerateReportsService,
    private readonly lenderService: AssociateLenderService
  ) {}

  ngOnInit(): void {
    this.loanTypes = this.lenderService.currentLenderLoanTypes;
    this.reportService.setLoanTypes(this.loanTypes)
  }
}
