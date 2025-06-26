import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { get } from "lodash";

@Component({
  selector: "app-dedupe-loan-selection",
  templateUrl: "./dedupe-loan-selection.component.html",
  styleUrls: ["./dedupe-loan-selection.component.scss"],
})
export class DedupeLoanSelectionComponent implements OnInit {
  @Input() dedupeLoans: Array<any> = [];
  disableDedupe:boolean = true;
  
  constructor(private readonly activatedRoute:ActivatedRoute) {}


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      this.disableDedupe = data["dedupe"];
    })
  }
  openLoan(loanData) {
    const loanId = get(loanData, "id") || null;
    if (loanId) {
      window.open(`/#/kcredit/loan/${loanId}?dedupe=false`, "_blank");
    } else {
      alert("Loan ID is not available");
    }
  }
}
