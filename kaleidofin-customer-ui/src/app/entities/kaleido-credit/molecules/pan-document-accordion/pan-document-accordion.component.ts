import { Component, Input, OnInit } from "@angular/core";
import { CoapplicantLoanApplicationDocumentDTO, LoanApplicationDocumentDTO } from "../../models/loan-application-document.model";
import { getProperty } from "src/app/utils/app.utils";
@Component({
  selector: "app-pan-document-accordion",
  templateUrl: "./pan-document-accordion.component.html",
})
export class PanDocumentAccordionComponent implements OnInit {
  @Input() loanId: number = null;
  @Input() partnerId: number = null;
  @Input() customerId: number = null;
  @Input() panDocuments: any = {};

  applicantPanDocuments: Array<LoanApplicationDocumentDTO> = [];
  coApplicantPanDocuments: Array<CoapplicantLoanApplicationDocumentDTO> = [];
  guarantorPanDocuments: Array<CoapplicantLoanApplicationDocumentDTO> = [];
  
  panelOpenState: boolean = false;
  coApplicantPanelOpenState: boolean = false;
  guarantorPanelOpenState: boolean = false;

  ngOnInit(): void {
    this.applicantPanDocuments = getProperty(this.panDocuments, "APPLICANT", []);
    this.coApplicantPanDocuments = getProperty(this.panDocuments, "CO_APPLICANT", []);
    this.guarantorPanDocuments = getProperty(this.panDocuments, "GUARANTOR", []);
  }

}
