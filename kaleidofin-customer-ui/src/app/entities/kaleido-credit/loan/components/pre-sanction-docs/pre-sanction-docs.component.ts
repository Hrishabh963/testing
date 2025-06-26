import { Component, OnInit, Input } from "@angular/core";
import { AUTHORITES } from "../../../constants/authorization.constants";
import {
  CoapplicantLoanApplicationDocumentDTO,
  LoanApplicationDocumentDTO,
} from "../../../models/loan-application-document.model";
import { getProperty } from "src/app/utils/app.utils";
import { get } from "lodash";
import { DocumentsService } from "../../../services/documents.service";

@Component({
  selector: "app-pre-sanction-docs",
  templateUrl: "./pre-sanction-docs.component.html",
  styleUrls: ["./pre-sanction-docs.component.scss"],
})
export class PreSanctionDocsComponent implements OnInit {
  @Input() loanDetailDocuments: any = {};
  @Input() partnerId: any;
  @Input() loanId: any;
  @Input() customerId: number = null;
  panelOpenState: boolean = true;
  panPanelOpenState: boolean = false;
  documentTypes: any[] = [];
  authority = AUTHORITES.UNDERWRITINGSCREEN_PRESANCTIONCONDITIONALLYREJECT;
  panDocuments: any = {};
  constructor(private readonly documentService: DocumentsService) {}

  ngOnInit(): void {
    this.panDocuments = this.documentService.extractPan(this.loanDetailDocuments);
    this.documentTypes = Object.keys(this.loanDetailDocuments || {});
    this.panelOpenState = get(this.documentTypes, "length", 0) > 0 || Object.keys(this.panDocuments).length > 0;
  }

  
}
