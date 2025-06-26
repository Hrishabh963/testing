import { Input, Component, OnInit } from "@angular/core";
import { KcreditLoanDetailsModel } from "../../loan/kcredit-loanDetails.model";
import { getProperty } from "src/app/utils/app.utils";
import { UiConfigService } from "../../services/ui-config.service";
import { AssociateLenderService } from "../../services/associate-lender/associate-lender.service";

@Component({
  selector: "app-borrower-details",
  templateUrl: "./borrower-details.component.html"
})
export class BorrowerDetailsComponent implements OnInit {
  @Input() loanDetails: KcreditLoanDetailsModel;
  @Input() editSections: boolean = true;
  coApplicants: Array<any> = [];
  showEditButton: boolean = false;

  constructor(
    private readonly uiConfigService: UiConfigService,
    private readonly associateLenderService: AssociateLenderService
  ) {}

  applicantDetails: any = [];
  coApplicantDetails: any = [];
  guarantorDetails: any = [];

  ngOnInit(): void {
    this.showEditButton =
      this.associateLenderService.getLenderCode().toLowerCase() === "dcbmfi";
    this.coApplicants = getProperty(
      this.loanDetails,
      "loanObligatorDTOList",
      []
    );
    const loanId = getProperty(this.loanDetails, "loanApplicationDTO.id", null);
    this.uiConfigService
      .getUiInformationBySections("BORROWER_DETAILS", loanId)
      .subscribe(
        (response: any) => {
          const subsections: Array<any> = getProperty(
            response,
            "subSections",
            []
          );
          this.applicantDetails = subsections.filter(
            (section) => getProperty(section, "title", "") === "Applicant"
          );
          this.coApplicantDetails = subsections.filter(
            (section) => getProperty(section, "title", "") === "CoApplicants"
          );
          this.coApplicantDetails = getProperty(
            this.coApplicantDetails,
            "[0].subSections",
            []
          );
          this.guarantorDetails = subsections.filter(
            (section) => getProperty(section, "title", "") === "Guarantors"
          );
          this.guarantorDetails = getProperty(
            this.guarantorDetails,
            "[0].subSections",
            []
          );
        },
        (error) => console.error(error)
      );
  }
}
