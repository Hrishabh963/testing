import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { cloneDeep } from "lodash";
import { RejectReasonPipe } from "../../../shared/pipes/ig-custom-refcode.pipe";
import { Errors } from "../../constant";
import { KcreditLoanDetailsModel } from "../../kcredit-loanDetails.model";
import { CoApplicantKycDetail } from "../../../models/kyc-details.model";

@Component({
  selector: "jhi-co-applicants",
  templateUrl: "./co-applicants.component.html",
  styleUrls: ["../../kcredit-loan.css"],
})
export class CoApplicantsComponent {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() disableEdit: boolean;
  @Input() coApplicants: any[];
  @Input() loanId: any;
  @Input() partnerId: any;
  @Input() riskCategoryEnabled: boolean = false;
  @Input() coApplicantKycDetails: CoApplicantKycDetail[] = [];
  @Output() reloadAfterSave = new EventEmitter<any>();

  readonly errorConstants = Errors;

  public errorMatcher = null;
  public coApplicantDocs = [];
  public coApplicantDocsByPurpose = {};
  initialCoApplicants: any[];
  editCoApplicantDetails: boolean = false;
  poiPanelOpenState: boolean = true;
  poaPanelOpenState: boolean = true;
  maxDate: Date;
  minDate: Date;
  panelOpenState: boolean = true;
  
  constructor(
    public readonly domSanitizer: DomSanitizer,
    public readonly rejectReasonPipe: RejectReasonPipe
  ) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.minDate = new Date(1930, 1, 1);
    this.coApplicants.forEach((coApplicant) =>
      this.getCoApplicantKycDocs(coApplicant)
    );
    this.initialCoApplicants = cloneDeep(this.coApplicants);
  }

  getCoApplicantKycDocs(coApplicant: any = {}) {
    let docs = this.coApplicantKycDetails?.filter(
      (document: any) => document?.entityId === coApplicant?.id
    );
    coApplicant["kycDocuments"] = docs;
  }
}
