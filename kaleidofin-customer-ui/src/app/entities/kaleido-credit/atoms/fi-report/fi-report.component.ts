import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getProperty } from "src/app/utils/app.utils";
import { PdfExportService } from "../../services/pdfexport.service";

@Component({
  selector: "app-fi-report",
  templateUrl: "./fi-report.component.html",
  styleUrls: ["./fi-report.component.scss"],
})
export class FiReportComponent implements OnInit {
  reportData: any = {};
  applicantName: string = null;

  fieldDisplayNames = {
    latitudeAndLongitude: { label: "Latitude & Longitude" },
    reference1Name: { label: "Reference 1 Name" },
    reference1MobileNumber: { label: "Reference 1 Mobile Number" },
    reference1RelationShipToApplicant: {
      label: "Reference 1 Relationship to Applicant",
    },
    reference2Name: { label: "Reference 2 Name" },
    reference2MobileNumber: { label: "Reference 2 Mobile Number" },
    reference2RelationShipToApplicant: {
      label: "Reference 2 Relationship to Applicant",
    },
    feedBackOfReference1NoOfYearsKnowingTheBorrower: {
      label: "Feedback of Reference 1 & No of years of knowing the borrower",
    },
    feedBackOfReference2NoOfYearsKnowingTheBorrower: {
      label: "Feedback of Reference 2 & No of years of knowing the borrower",
    },
    isReferenceFeedbackPositive: { label: "Is Reference feedback Positive" },
    cautionProfile: { label: "Caution Profile" },
    dateOfVisit: { label: "Date of Visit" },
    distanceOfCustomerHouseFromDCBBankBranch: {
      label: "Distance of Customer house from DCB Bank branch",
    },
    purposeOfLoan: { label: "Purpose of Loan" },
    isApplicantEndUser: {
      label: "Is the applicant the end user of the tractor",
    },
    occupation: { label: "Occupation" },
    natureOfSelfEmployment: { label: "Nature of self employment" },
    residence: { label: "Residence" },
    cibilScoreOfApplicant: { label: "CIBIL Score of Applicant" },
    isTractorDelivered: { label: "Has the tractor been delivered" },
    deliveryDate: {
      label: "Date of delivery",
      pipe: "date",
      format: "dd-MM-yyyy",
    },
    hmr: { label: "HMR" },
    days: { label: "Days (From Asset delievered date)" },
    manufacturer: { label: "Manufacturer" },
    model: { label: "Model" },
    engineNumber: { label: "Engine number" },
    chasisNumber: { label: "Chassis Number" },
    rcNumber: { label: "RC number" },
    haveExistingTractor: {
      label: "Is the Borrower having an existing Tractor",
    },
    havingAnExistingTractorWithDcb: {
      label: "Is the Borrower or in family having an existing Tractor with DCB",
    },
    distanceOfReference1FromBorrowersHouse: {
      label: "Distance of reference 1 house from borrower's house",
    },
    distanceOfReference2FromBorrowersHouse: {
      label: "Distance of reference 2 house from borrower's house",
    },
    confirmationOfCriticalChecks: {
      label: "Confirmation of critical checks at visit time",
    },
    tractorInRunningCondition: { label: "Tractor in running condition" },
    tractorServiceCenterFeedback: { label: "Tractor service centre feedback" },
    rmRemark: { label: "RM remarks on FI" },
  };
  constructor(
    private readonly route: ActivatedRoute,
    private readonly pdfExportService: PdfExportService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty("data")) {
        const serializedData = params["data"];
        let data = JSON.parse(decodeURIComponent(window.atob(serializedData)));
        this.reportData = getProperty(data, "fields") || {};
        this.applicantName = getProperty(data, "applicantName", null);
      }
    });
  }
  getFieldKeys(): string[] {
    return Object.keys(this.fieldDisplayNames);
  }
  downloadPdf(): void {
    const fileName = this.applicantName
      ? `${this.applicantName}_FI_Report`
      : null;
    this.pdfExportService.downloadCurrentPageAsPdf(fileName);
  }
}
