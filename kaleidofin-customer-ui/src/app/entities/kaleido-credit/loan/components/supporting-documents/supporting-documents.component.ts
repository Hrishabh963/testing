import { Component, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { get } from "lodash";
import { DocumentTypes } from "../../constant";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";

@Component({
  selector: "jhi-supporting-documents",
  templateUrl: "./supporting-documents.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class SupportingDocumentsComponent {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Input() loanId: any;
  @Input() partnerId: any;
  public panelOpenState: boolean = false;
  public documents: any[] = [];

  constructor(public domSanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.loanDetails) {
      // Fetching Documents -Additional Documents
      let loanDocuments =
        get(this.loanDetails, "loanApplicationDocumentDTOList", []) || [];
      if (loanDocuments) {
        this.documents = loanDocuments.filter(
          (doc) =>
            doc && ["", DocumentTypes.supportingDocument].includes(doc.documentType)
        );
      }
    }
  }
}
