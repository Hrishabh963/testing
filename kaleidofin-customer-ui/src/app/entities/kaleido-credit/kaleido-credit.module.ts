import {
  CUSTOM_ELEMENTS_SCHEMA,
  Injector,
  NO_ERRORS_SCHEMA,
  NgModule,
} from "@angular/core";
import { RouterModule } from "@angular/router";

import {
  KCredit,
  KaleidoCreditResolvePagingParams,
} from "./kaleido-credit.route";
import { KCreditService } from "./kaleido-credit.service";
import { OverviewComponent } from "./overview/overview.component";
import { KCreditReportComponent } from "./report/kcredit-report.component";
import { KcreditUploadComponent } from "./upload/kcredit-upload.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedLibModule, SharedModule } from "src/app/shared";
import {
  KCreditLoanHistoryComponent,
  KCreditReportGenerationComponent,
} from ".";
import { ReportGenerationService } from "./genreport/kcredit-reportgen.service";
import { AadhaarIdfyComponent } from "./loan/components/aadhaar-idfy/aadhaar-idfy.component";
import { AboutTheBusinessComponent } from "./loan/components/about-the-business/about-the-business.component";
import { AboutTheEntrepreneurComponent } from "./loan/components/about-the-entrepreneur/about-the-entrepreneur";
import { AboutTheLoanComponent } from "./loan/components/about-the-loan/about-the-loan.component";
import { AdditionalDataComponent } from "./loan/components/additional-data/additional-data.component";
import { AdditionalDocumentComponent } from "./loan/components/additional-documents/additional-document.component";
import { AgentInfoComponent } from "./loan/components/agent-info/agent-info.component";
import { AssociateEntityComponent } from "./loan/components/associate-entity/associate-entity.component";
import { LoanDetailsBankValidation } from "./loan/components/bank-details-penny-drop-popup/loan-details-bank-validation.component";
import { AllBankDetailsComponent } from "./loan/components/bank-details/all-bank-details.component";
import { BankDetailsComponent } from "./loan/components/bank-details/bank-details.component";
import { BankStatementComponent } from "./loan/components/bank-statement/bank-statement.component";
import { BasicCustomerAddressComponent } from "./loan/components/basic-customer-info/basic-customer-address.component";
import { BasicCustomerInfoComponent } from "./loan/components/basic-customer-info/basic-customer-info.component";
import { CoApplicantsComponent } from "./loan/components/co-applicants/co-applicants.component";
import { ContactPersonComponent } from "./loan/components/contact-person/contact-person.component";
import { CreditBureauInfoComponent } from "./loan/components/credit-bureau-info/credit-bureau-info.component";
import { ExistingLoanItemComponent } from "./loan/components/existing-loans/existing-loan-item.component";
import { ExistingLoansComponent } from "./loan/components/existing-loans/existing-loans.component";
import { FamilyAssetsComponent } from "./loan/components/family-assets/family-assets.component";
import { FamilyInfoComponent } from "./loan/components/family-info/family-info.component";
import { FamilyMemberComponent } from "./loan/components/family-info/family-member.component";
import { FinancialDetailsItemComponent } from "./loan/components/financial-details/financial-details-item.component";
import { FinancialDetailsComponent } from "./loan/components/financial-details/financial-details.component";
import { GuarantorMemberComponent } from "./loan/components/guarantor/guarantor-member.component";
import { GuarantorComponent } from "./loan/components/guarantor/guarantor.component";
import { ImageEditorPopupService } from "./loan/components/image-editor/image-editor-popup.service";
import { KcplFeeDetailsComponent } from "./loan/components/kcpl-fee-details/kcpl-fee-details.component";
import { KiScoreComponent } from "./loan/components/ki-score/ki-score.component";
import { KycComponent } from "./loan/components/kyc/kyc.component";
import { LoanComponent } from "./loan/components/loan/loan.component";
import { NomineeInfoComponent } from "./loan/components/nominee-info/nominee-info.component";
import { PartnerInfoComponent } from "./loan/components/partner-info/partner-info.component";
import { ProjectFundingDetailsComponent } from "./loan/components/project-funding-details/project-funding-details.component";
import { PropertyDetailsComponent } from "./loan/components/property-details/property-details.component";
import { ReferencesComponent } from "./loan/components/references/references.component";
import { SupportingDocumentsComponent } from "./loan/components/supporting-documents/supporting-documents.component";
import { TradeReferencesItemComponent } from "./loan/components/trade-references/trade-references-item.component";
import { TradeReferencesComponent } from "./loan/components/trade-references/trade-references.component";
import { WitnessComponent } from "./loan/components/witnesses/witnesses.component";
import { KCreditLoanComponent } from "./loan/kcredit-loan.component";
import { KcreditLoanResolve } from "./loan/kcredit-loan.resolve";
import { KcreditLoanService } from "./loan/kcredit-loan.service";
import { ScrollSpyDirective } from "./loan/scroll-spy.directive";
import { KCreditLoanEntryComponent } from "./loanentry/kcredit-loanentry.component";
import { NullReplaceComponent } from "./null-replace";
import { LoanApplicationReviewAcceptDialogComponent } from "./report/kcredit-confirmation-accept-dialog";
import { LoanApplicationReviewDialogComponent } from "./report/kcredit-confirmation-dialog";
import { LoanApplicationReviewRejectDialogComponent } from "./report/kcredit-confirmation-reject-dialog";
import { LoanReviewPopupService } from "./report/kcredit-popup-service";
import { LoanReviewService } from "./report/loan-review.service";
import { SubscriptionReviewModelService } from "./services/customer-group/subscription-review/subscription-review-model.service";
import { SubscriptionReviewPopupService } from "./services/customer-group/subscription-review/subscription-review-popup.service";
import { SubscriptionReviewSupportService } from "./services/customer-group/subscription-review/subscription-review-support.service";
import { SubscriptionReviewService } from "./services/customer-group/subscription-review/subscription-review.service";
import { UpdatedSubscriptionDataService } from "./services/customer-group/subscription-review/updated-subscription-data.service";
import { CustomerService } from "./services/customer/customer.service";
import { FileService } from "./services/files/file.service";
import { ImportDataService } from "./services/import-data/import-data.service";
import { PartnersService } from "./services/partner/partners.service";
import { RejectReasonPipe } from "./shared/pipes/ig-custom-refcode.pipe";
import { SearchComponent } from "./shared/search-component/search.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { SingleTenancyInterceptor } from "src/app/blocks/interceptor/single-tenancy.interceptor";
import { CustomDatePipe } from "./dedupe/custom-date.pipe";
import { DedupeAccordionComponent } from "./dedupe/dedupe-accordion/dedupe-accordion.component";
import { DedupeDataComponent } from "./dedupe/dedupe-data/dedupe-data.component";
import { DedupeFormComponent } from "./dedupe/dedupe-form/dedupe-form.component";
import { DedupeLoanSelectionComponent } from "./dedupe/dedupe-loan-selection/dedupe-loan-selection.component";
import { DedupesComponent } from "./dedupe/dedupe.component";
import { DownloadLoanReportPopupComponent } from "./genreport/download-loan-report-popup/download-loan-report-popup.component";
import { LoanStatusMenuComponent } from "./genreport/loan-status-menu/loan-status-menu.component";
import { KcreditInterDataService } from "./kcredit-inter-data.service";
import { BreReportComponent } from "./loan/components/business-rule-engine/bre-report/bre-report.component";
import { BusinessRuleEngineComponent } from "./loan/components/business-rule-engine/business-rule-engine.component";
import { CreditBureauService } from "./loan/components/credit-bureau-info/credit-bureau.service";
import { ApplicantComponent } from "./loan/components/dedupe/applicant.component";
import { DedupeComponent } from "./loan/components/dedupe/dedupe.component";
import { DownloadLoanReportComponent } from "./loan/components/download-loan-report/download-loan-report.component";
import { KiScoreReportComponent } from "./loan/components/ki-score-report/ki-score-report.component";
import { LoanApprovalConfirmationPopupComponent } from "./loan/components/loan-approval-confirmation-popup/loan-approval-confirmation-popup.component";
import { PostBookingDocsComponent } from "./loan/components/post-booking-docs/post-booking-docs.component";
import { PostDisbursementDocsComponent } from "./loan/components/post-disbursement-docs/post-disbursement-docs.component";
import { PostSanctionDocsComponent } from "./loan/components/post-sanction-docs/post-sanction-docs.component";
import { PreSanctionDocsComponent } from "./loan/components/pre-sanction-docs/pre-sanction-docs.component";
import { UploadReportPopupComponent } from "./loan/components/upload-reports/upload-report-popup/upload-report-popup.component";
import { UploadReportsComponent } from "./loan/components/upload-reports/upload-reports.component";
import { ReportsDataComponent } from "./molecules/reports/reports-data/reports-data.component";
import { ReportsFilterComponent } from "./molecules/reports/reports-filter/reports-filter.component";
import { KicreditReportsComponent } from "./organisms/kicredit-reports/kicredit-reports.component";
import { ProductCodeService } from "./services/product-code/product-code.service";
import { CustomConfirmationModalComponent } from "./shared/custom-confirmation-modal/custom-confirmation-modal.component";
import { CustomDisplayPopupComponent } from "./shared/custom-display-popup/custom-display-popup.component";
import { CustomErrorPopupComponent } from "./shared/custom-error-popup/custom-error-popup.component";
import { CustomMessageDisplayComponent } from "./shared/custom-message-display/custom-message-display.component";
import { CustomToastMessageComponent } from "./shared/custom-toast-message/custom-toast-message.component";
import { FileUploadComponent } from "./shared/file-upload/file-upload.component";
import { ProgressBarComponent } from "./shared/file-upload/progress-bar/progress-bar.component";
import { DocTitleContainerComponent } from "./shared/loan-application-documents/doc-title-container/doc-title-container.component";
import { LoanDocumentAccordionItemComponent } from "./shared/loan-application-documents/loan-document-accordion-item/loan-document-accordion-item.component";
import { LoanDocumentAccordionComponent } from "./shared/loan-application-documents/loan-document-accordion/loan-document-accordion.component";
import { LoanKycDocumentAccoridonComponent } from "./shared/loan-application-documents/loan-kyc-document-accoridon/loan-kyc-document-accoridon.component";
import { TagDialogComponent } from "./shared/loan-application-documents/tag-dialog/tag-dialog.component";
import { LoanIncompleteReasonDialogComponent } from "./shared/loan-incomplete-reason/loan-incomplete-reason-dialog/loan-incomplete-reason-dialog.component";
import { LoanIncompleteReasonComponent } from "./shared/loan-incomplete-reason/loan-incomplete-reason/loan-incomplete-reason.component";
import { SelectAllComboBoxComponent } from "./shared/select-all-combo-box/select-all-combo-box.component";
import { CustomUploadDatePipe } from "./upload/custom-upload-date.pipe";

import { AddCommentComponent } from "./atoms/add-comment/add-comment.component";
import { AdditionalTractorDetailsComponent } from "./atoms/additional-tractor-details/additional-tractor-details.component";
import { AddressFieldComponent } from "./atoms/address-field/address-field.component";
import { AmlHitTableComponent } from "./atoms/aml-hit-table/aml-hit-table.component";
import { AtdReportComponent } from "./atoms/atd-report/atd-report.component";
import { BeneficiaryResponseDetailsComponent } from "./atoms/beneficiary-response-details/beneficiary-response-details.component";
import { ApprovalAuthorityComponent } from "./atoms/cams-report/approval-authority/approval-authority.component";
import { BankFundingComponent } from "./atoms/cams-report/bank-funding/bank-funding.component";
import { CamsReportComponent } from "./atoms/cams-report/cams-report.component";
import { CreditFeedbackComponent } from "./atoms/cams-report/credit-feedback/credit-feedback.component";
import { CustomerAssetRequirementComponent } from "./atoms/cams-report/customer-asset-requirement/customer-asset-requirement.component";
import { CustomerCriteriaComponent } from "./atoms/cams-report/customer-criteria/customer-criteria.component";
import { DeviationsComponent } from "./atoms/cams-report/deviations/deviations.component";
import { EligibilityCalculationComponent } from "./atoms/cams-report/eligibility-calculation/eligibility-calculation.component";
import { FieldVisitReferenceComponent } from "./atoms/cams-report/field-visit-reference/field-visit-reference.component";
import { FinancialLiabilityDetailsComponent } from "./atoms/cams-report/financial-liability-details/financial-liability-details.component";
import { DateFieldComponent } from "./atoms/date-field/date-field.component";
import { InputFieldComponent } from "./atoms/input-field/input-field.component";
import { MultiSelectSearchBoxComponent } from "./atoms/multi-select-search-box/multi-select-search-box.component";
import { NumberFieldComponent } from "./atoms/number-field/number-field.component";
import { RadioButtonFieldComponent } from "./atoms/radio-button-field/radio-button-field.component";
import { ReportTableComponent } from "./atoms/report-table/report-table.component";
import { SelectFieldComponent } from "./atoms/select-field/select-field.component";
import { ActivityAllComponent } from "./molecules/activity-all/activity-all.component";
import { ActivityCommentsComponent } from "./molecules/activity-comments/activity-comments.component";
import { CommentComponent } from "./molecules/activity-comments/comment/comment.component";
import { InputAlphaFieldComponent } from "./atoms/input-alpha-field/input-alpha-field.component";
import { ActivityHistoryComponent } from "./molecules/activity-history/activity-history.component";
import { HistoryActivityComponent } from "./molecules/activity-history/history-activity/history-activity.component";
import { AmlDetailsAccordionComponent } from "./molecules/aml-details-accordion/aml-details-accordion.component";
import { ApplicantScorecardComponent } from "./molecules/applicant-scorecard/applicant-scorecard.component";
import { AssignToUserComponent } from "./molecules/assign-to-user/assign-to-user.component";
import { BorrowerBeneficiaryCheckComponent } from "./molecules/borrower-beneficiary-check/borrower-beneficiary-check.component";
import { ApplicantDetailsComponent } from "./molecules/borrower-details/applicant-details/applicant-details.component";
import { BorrowerDetailsComponent } from "./molecules/borrower-details/borrower-details.component";
import { CoApplicantComponent } from "./molecules/borrower-details/co-applicant-details/co-applicant-details.component";
import { BreComponent } from "./molecules/bre/bre.component";
import { CamsSheetComponent } from "./molecules/cams-sheet/cams-sheet.component";
import { CoApplicantDetailsComponent } from "./molecules/co-applicant-details/co-applicant-details.component";
import { CommonReportsDownloadComponent } from "./molecules/common-reports-download/common-reports-download.component";
import { FraudCheckReportComponent } from "./molecules/fraud-check-report/fraud-check-report.component";
import { KycResultsTableComponent } from "./molecules/kyc-results-table/kyc-results-table.component";
import { LoanApplicationSearchFilterComponent } from "./molecules/loan-application-search-filter/loan-application-search-filter.component";
import { LoanApplicationTableComponent } from "./molecules/loan-application-table/loan-application-table.component";
import { LoanOverviewComponent } from "./molecules/loan-overview/loan-overview.component";
import { LoanStageBreadcrumbsComponent } from "./molecules/loan-stage-breadcrumbs/loan-stage-breadcrumbs.component";
import { LoanStageDisplayComponent } from "./molecules/loan-stage-display/loan-stage-display.component";
import { UploadDataComponent } from "./molecules/uploads/upload-data/upload-data.component";
import { UploadFilterComponent } from "./molecules/uploads/upload-filter/upload-filter.component";
import { AntiMoneyLaunderingComponent } from "./organisms/anti-money-laundering/anti-money-laundering.component";
import { BeneficiaryCheckDetailsComponent } from "./organisms/beneficiary-check-details/beneficiary-check-details.component";
import { DynamicRenderComponent } from "./organisms/dynamic-render/dynamic-render.component";
import { FraudCheckComponent } from "./organisms/fraud-check/fraud-check.component";
import { KicreditUploadsComponent } from "./organisms/kicredit-uploads/kicredit-uploads.component";
import { LoanActivityComponent } from "./organisms/loan-activity/loan-activity.component";
import { AddressFormatPipe } from "./shared/pipes/address-format.pipe";
import { CurrencyPipe } from "./shared/pipes/currency.pipe";
import { CustomDatePipeCommonFormat } from "./shared/pipes/date.pipe";
import { DynamicDataTransformPipe } from "./shared/pipes/dynamic-data-transform.pipe";
import { FormatArrayToStringPipe } from "./shared/pipes/format-array-to-string.pipe";

import { BankFundingDetailsComponent } from "./atoms/cams-report/bank-funding-details/bank-funding-details.component";
import { CamsSectionComponent } from "./atoms/cams-report/cams-section/cams-section.component";
import { VehicleInsuranceDetailsComponent } from "./atoms/cams-report/vehicle-insurance-details/vehicle-insurance-details.component";
import { EkycImageComponent } from "./atoms/ekyc-image/ekyc-image.component";
import { FiReportComponent } from "./atoms/fi-report/fi-report.component";
import { MfiCamCustomerInfoComponent } from "./atoms/mfi-cam-customer-info/mfi-cam-customer-info.component";
import { MfiCamHouseholdIncomeComponent } from "./atoms/mfi-cam-household-income/mfi-cam-household-income.component";
import { MfiCamHouseholdProfileComponent } from "./atoms/mfi-cam-household-profile/mfi-cam-household-profile.component";
import { MfiCamIrregularExpensesComponent } from "./atoms/mfi-cam-irregular-expenses/mfi-cam-irregular-expenses.component";
import { MfiCamOtherYearlyIncomeComponent } from "./atoms/mfi-cam-other-yearly-income/mfi-cam-other-yearly-income.component";
import { MfiCamRegularExpensesComponent } from "./atoms/mfi-cam-regular-expenses/mfi-cam-regular-expenses.component";
import { SelectWithInputComponent } from "./atoms/select-with-input/select-with-input.component";
import { UserInactivityPopupComponent } from "./atoms/user-inactivity-popup/user-inactivity-popup.component";
import { NotificationItemComponent } from "./loan/components/NotificationItem/notification-item.component";
import { NotificationComponent } from "./loan/components/notification/notification.component";
import { CreditBureauDataComponent } from "./molecules/credit-bureau-data/credit-bureau-data.component";
import { CropInformationComponent } from "./molecules/crop-information/crop-information.component";
import { DedupeInfoDetailsComponent } from "./molecules/dedupe-info-details/dedupe-info-details.component";
import { DeviationsTableComponent } from "./molecules/deviations-table/deviations-table.component";
import { EkycDetailsSectionComponent } from "./molecules/ekyc-details-section/ekyc-details-section.component";
import { GroupInfoComponent } from "./molecules/group-info/group-info.component";
import { GroupTableComponent } from "./molecules/group-table/group-table.component";
import { KycDetailsAccordionComponent } from "./molecules/kyc-details-accordion/kyc-details-accordion.component";
import { MfiCamReportComponent } from "./molecules/mfi-cam-report/mfi-cam-report.component";
import { OtherIncomeDataComponent } from "./molecules/other-income-data/other-income-data.component";
import { SelectWithSearchComponent } from "./molecules/select-with-search/select-with-search.component";
import { BusinessDataSheetComponent } from "./organisms/business-data-sheet/business-data-sheet.component";
import { CbDataComponent } from "./organisms/cb-data/cb-data.component";
import { CustomerDemandScheduleComponent } from "./organisms/customer-demand-schedule/customer-demand-schedule.component";
import { DedupeInfoComponent } from "./organisms/dedupe-info/dedupe-info.component";
import { EkycSectionComponent } from "./organisms/ekyc-section/ekyc-section.component";
import { KycDetailsComponent } from "./organisms/kyc-details/kyc-details.component";
import { LandAndCropComponent } from "./organisms/land-and-crop/land-and-crop.component";
import { MultiFilterComponent } from "./organisms/multi-filter/multi-filter.component";
import { OtherIncomeDetailsComponent } from "./organisms/other-income-details/other-income-details.component";

import { ConfirmationAlertsComponent } from "./atoms/confirmation-alerts/confirmation-alerts.component";
import { EkycReportComponent } from "./atoms/ekyc-report/ekyc-report.component";
import { EkycTableComponent } from "./atoms/ekyc-table/ekyc-table.component";
import { LoanTypeFieldComponent } from "./atoms/loan-type-field/loan-type-field.component";
import { PartnerFieldComponent } from "./atoms/partner-field/partner-field.component";
import { ReportPurposeFieldComponent } from "./atoms/report-purpose-field/report-purpose-field.component";
import { ReportTypeFieldComponent } from "./atoms/report-type-field/report-type-field.component";
import { ErrorNotificationsItemComponent } from "./molecules/error-notifications-item/error-notifications-item.component";
import { GenerateReportPopupComponent } from "./molecules/generate-reports/generate-report-popup/generate-report-popup.component";
import { SearchFilterComponent } from "./molecules/generate-reports/search-filter/search-filter.component";
import { HouseholdInfoComponent } from "./molecules/household-info/household-info.component";
import { ApplicantFinancialLiabilitiesComponent } from "./organisms/applicant-financial-liabilities/applicant-financial-liabilities.component";
import { HouseholdDetailsComponent } from "./organisms/household-details/household-details.component";
import { NomineeDetailsComponent } from "./organisms/nominee-details/nominee-details.component";
import { OccupationDetailsComponent } from "./organisms/occupation-details/occupation-details.component";
import { CollateralMaintenanceVehicleComponent } from "./organisms/collateral-maintenance-vehicle/collateral-maintenance-vehicle.component";
import { DetailedDataEntryComponent } from "./organisms/detailed-data-entry/detailed-data-entry.component";
import { MfiIncomeDetailsComponent } from "./organisms/mfi-income-details/mfi-income-details.component";
import { ExpenseSectionComponent } from "./organisms/expense-section/expense-section.component";
import { SectionEditActionComponent } from "./atoms/section-edit-action/section-edit-action.component";
import { KiScoreAlertsComponent } from "./molecules/ki-score-alerts/ki-score-alerts.component";
import { CustomAlertsComponent } from "./atoms/custom-alerts/custom-alerts.component";
import { AddReworkDocumentComponent } from "./molecules/add-rework-document/add-rework-document";
import { ReworkDocumentsFormComponent } from "./molecules/rework-documents-form/rework-documents-form";
import { KiScoreUploadComponent } from "./organisms/ki-score-upload/ki-score-upload.component";
import { KiScoreResultsComponent } from "./organisms/ki-score-results/ki-score-results.component";
import { KiscoreDataUploadComponent } from "./molecules/kiscore-data-upload/kiscore-data-upload.component";
import { UploadKiscoreFileComponent } from "./organisms/ki-score-upload/upload-kiscore-file/upload-kiscore-file.component";
import { InsuranceDetailsComponent } from "./organisms/insurance-details/insurance-details.component";
import { InsuranceDataComponent } from "./models/insurance-data/insurance-data.component";
import { MultiSelectChipComponent } from "./atoms/multi-select-chip/multi-select-chip.component";
import { TableHeaderMultiSelectComponent } from "./atoms/table-header-multi-select/table-header-multi-select.component";
import { DeviationDocumentsComponent } from "./organisms/deviation-documents/deviation-documents.component";
import { EligibilityRulesComponent } from "./organisms/eligibility-rules/eligibility-rules.component";
import { RecalculateBrePopupComponent } from "./molecules/recalculate-bre-popup/recalculate-bre-popup.component";
import { BreResultPopupComponent } from "./molecules/bre-result-popup/bre-result-popup.component";
import { RecalculateBreComponent } from "./molecules/recalculate-bre/recalculate-bre.component";
import { CustomProgressBarComponent } from "./atoms/custom-progress-bar/custom-progress-bar.component";
import { KycResultsUpdatePopupComponent } from "./atoms/kyc-results-update-popup/kyc-results-update-popup.component";
import { ApplicantDetailsKcplComponent } from "./molecules/applicant-details-kcpl/applicant-details-kcpl.component";
import { RepaymentScheduleTableComponent } from "./atoms/repayment-schedule-table/repayment-schedule-table.component";
import { TableDateFieldComponent } from "./atoms/table-date-field/table-date-field.component";
import { RepaymentTableInputFieldComponent } from "./atoms/repayment-table-input-field/repayment-table-input-field.component";
import { DemandScheduleDetailComponent } from "./molecules/demand-schedule-detail/demand-schedule-detail.component";
import { DocumentRejectReasonComponent } from "./molecules/document-reject-reason/document-reject-reason.component";
import { DocumentReviewStatusAlert } from "./molecules/document-review-status-alert/document-review-status-alert.component";
import { DeviationsRemarksInputComponent } from "./atoms/deviations-remarks-input/deviations-remarks-input.component";
import { ConfirmationPopupComponent } from "./molecules/confirmation-popup/confirmation-popup.component";
import { FileSuccessUploadPopupComponent } from "./molecules/file-success-upload-popup/file-success-upload-popup.component";
import { KicreditOverviewComponent } from "./organisms/overview/kicredit-overview.component";
import { BusinessOnboardingComponent } from "./organisms/business/business-onboarding/business-onboarding.component";
import { BusinessReviewComponent } from "./organisms/business/business-review/business-review.component";
import { SupplierReferenceComponent } from "./molecules/business-invoice-discount/supplier-reference/supplier-reference.component";
import { BusinessProfileDetailsComponent } from "./molecules/business-invoice-discount/business-profile-details/business-profile-details.component";
import { BusinessRegistrationDetailsComponent } from "./molecules/business-invoice-discount/business-registration-details/business-registration-details.component";
import { BusinessRegistrationDocumentsComponent } from "./molecules/business-invoice-discount/business-registration-documents/business-registration-documents.component";
import { AuditComplianceDocumentsComponent } from "./molecules/business-invoice-discount/audit-compliance-documents/audit-compliance-documents.component";
import { OtherBusinessDocumentsComponent } from "./molecules/business-invoice-discount/other-business-documents/other-business-documents.component";
import { FactoringLimitComponent } from "./molecules/business-invoice-discount/factoring-limit/factoring-limit.component";
import { BusinessKycDocumentsComponent } from "./molecules/business-invoice-discount/kyc-documents/business-kyc-documents.component";
import { BusinessKycDetailsComponent } from "./molecules/business-invoice-discount/kyc-details/business-kyc-details.component";
import { NationalIdDetailsComponent } from "./molecules/business-invoice-discount/kyc-details/national-id-details/national-id-details.component";
import { BusinessKraComponent } from "./molecules/business-invoice-discount/kyc-details/business-kra/business-kra.component";
import { BusinessOwnerKraComponent } from "./molecules/business-invoice-discount/kyc-details/business-owner-kra/business-owner-kra.component";
import { BusinessDocumentComponent } from "./molecules/business-invoice-discount/business-document/business-document.component";
import { BusinessDocumentItemComponent } from "./molecules/business-invoice-discount/business-document/business-document-item/business-document-item.component";
import { BusinessReviewApprovePopupComponent } from "./organisms/business-review-popups/business-review-approve-popup/business-review-approve-popup.component";
import { BusinessSectionActionButtonsComponent } from "./molecules/business-invoice-discount/business-section-action-buttons/business-section-action-buttons.component";
import { SectionLevelRejectComponent } from "./molecules/business-invoice-discount/section-level-reject/section-level-reject.component";
import { BusinessRegDetailItemComponent } from "./molecules/business-invoice-discount/business-registration-details/business-reg-detail-item/business-reg-detail-item.component";
import { BusinessAgreementComponent } from "./molecules/business-invoice-discount/business-agreement/business-agreement.component";
import { UserProfileComponent } from "./organisms/user-profile/user-profile.component";
import { LandingComponent } from "./organisms/landing/landing.component";
import { LoginFormComponent } from "./molecules/login-form/login-form.component";
import { PasswordInputComponent } from "./atoms/password-input/password-input.component";
import { SetNewPasswordComponent } from "./molecules/set-new-password/set-new-password.component";
import { TextInputComponent } from "./atoms/text-input/text-input.component";
import { NotifyMessageComponent } from "./molecules/notify-message/notify-message.component";
import { LoginPageButtonComponent } from "./atoms/login-page-button/login-page-button.component";
import { CustomValidator } from "src/app/shared/validations/custom.validation";

import { UserProfileNavigationComponent } from "./molecules/user-profile-navigation/user-profile-navigation.component";
import { UserProfileInfoComponent } from "./molecules/user-profile-info/user-profile-info.component";
import { ProfileInfoCardComponent } from "./atoms/profile-info-card/profile-info-card.component";
import { ChangePasswordComponent } from "./molecules/change-password/change-password.component";
import { FormComponent } from "./molecules/form/form.component";
import { LoginComponent } from "./molecules/login/login.component";
import { ResetPasswordComponent } from "./molecules/reset-password/reset-password.component";
import { ForgetPasswordComponent } from "./molecules/forget-password/forget-password.component";
import { ResetPasswordNotifyComponent } from "./molecules/reset-password-notify/reset-password-notify.component";
import { SetNewPasswordNotifyComponent } from "./molecules/set-new-password-notify/set-new-password-notify.component";
import { PasswordChangedNotifyComponent } from "./molecules/password-changed-notify/password-changed-notify.component";
import { PoweredByKaleidofinComponent } from "./atoms/powered-by-kaleidofin/powered-by-kaleidofin.component";
import { NeedHelpComponent } from "./atoms/need-help/need-help.component";
import { AccountTemporarilyBlockedNotifyComponent } from "./molecules/account-temporarily-blocked-notify/account-temporarily-blocked-notify.component";
import { JhiEventManager } from "ng-jhipster";
import { CustomSuccessSnackBar } from "./molecules/custom-success-snackbar/custom-success-snackbar";

import { TrackSectionVisibilityDirective } from "./directives/track-section-visibility.directive";
import { PanDocumentAccordionComponent } from "./molecules/pan-document-accordion/pan-document-accordion.component";
import { CommonDocumentAccordionComponent } from "./molecules/common-document-accordion/common-document-accordion.component";
import { AmlAdverseMediaPopupComponent } from './molecules/aml-adverse-media-popup/aml-adverse-media-popup.component';

import { TreeViewComponentComponent } from "./molecules/tree-view-component/tree-view-component.component";
import { UserAccessManagementComponent } from "./organisms/user-access-management/user-access-management.component";
import { StatusIndicatorComponent } from "./atoms/user-access-manager/status-indicator/status-indicator.component";
import { AddNewUserDialogComponent } from "./organisms/add-new-user-dialog/add-new-user-dialog.component";
import { UserDetailsContainerComponent } from "./molecules/user-details-container/user-details-container.component";
import { UamRolesCheckboxGroupComponent } from "./molecules/uam-roles-checkbox-group/uam-roles-checkbox-group.component";
import { UserChangePasswordComponent } from "./molecules/user-change-password/user-change-password.component";
import { UamConfirmationPopupComponent } from "./molecules/uam-confirmation-popup/uam-confirmation-popup.component";
import { UamSearchFilterComponent } from "./organisms/uam-search-filter/uam-search-filter.component";
import { DisableClipboardDirective } from "./directives/DisableClipboardDirective";
import { DisablePasteDirective } from "./directives/DisablePasteDirective";
import { BreSubsectionsComponent } from "./molecules/bre/bre-subsections/bre-subsections.component";
import { PercentageFormatPipe } from "./shared/percentage-format.pipe";
import { BusinessIncomeExpenseComponent } from "./organisms/business-income-expense/business-income.component";
import { HouseHoldIncomeExpenseComponent } from "./organisms/household-income-expense/household-income.component";
import { HouseHoldProfileComponent } from "./organisms/household-profile/household-profile.component";
import { LoanEligiblityComponent } from "./organisms/loan-eligiblity/loan-eligiblity.component";
import { LoanObligatorIncomeComponent } from "./organisms/loan-obligator-income/loan-obligator-income.component";
import { CustomSnackbarComponent } from "./molecules/custom-snackbar/custom-snackbar.component";
import { UploadedDocumentsComponent } from "./loan/components/upload-reports/uploaded-documents/uploaded-documents.component";
import { InfoTooltipComponent } from "./atoms/quick-info/quick-info.component";
import { DocumentViewerComponent } from './atoms/document-viewer/document-viewer.component';
import { DedupeCheckPopupComponent } from "./molecules/dedupe-check-popup/dedupe-check-popup.component";

@NgModule({
  imports: [
    SharedModule,
    SharedLibModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(KCredit, { useHash: true }),
  ],
  declarations: [
    OverviewComponent,
    KCreditReportComponent,
    KCreditReportGenerationComponent,
    KCreditLoanEntryComponent,
    KCreditLoanHistoryComponent,
    KcreditUploadComponent,
    KCreditLoanComponent,
    ScrollSpyDirective,
    AboutTheBusinessComponent,
    AboutTheEntrepreneurComponent,
    AboutTheLoanComponent,
    AgentInfoComponent,
    BankDetailsComponent,
    BasicCustomerInfoComponent,
    AadhaarIdfyComponent,
    ExistingLoansComponent,
    FamilyAssetsComponent,
    FamilyInfoComponent,
    GuarantorComponent,
    KiScoreComponent,
    KycComponent,
    NomineeInfoComponent,
    SupportingDocumentsComponent,
    CoApplicantsComponent,
    AdditionalDocumentComponent,
    AboutTheLoanComponent,
    LoanComponent,
    AdditionalDataComponent,
    LoanApplicationReviewDialogComponent,
    LoanApplicationReviewRejectDialogComponent,
    LoanApplicationReviewAcceptDialogComponent,
    BankStatementComponent,
    WitnessComponent,
    ReferencesComponent,
    CoApplicantsComponent,
    NullReplaceComponent,
    GuarantorMemberComponent,
    FamilyMemberComponent,
    ExistingLoanItemComponent,
    BasicCustomerAddressComponent,
    KcplFeeDetailsComponent,
    AssociateEntityComponent,
    ProjectFundingDetailsComponent,
    TradeReferencesComponent,
    TradeReferencesItemComponent,
    FinancialDetailsComponent,
    FinancialDetailsItemComponent,
    PropertyDetailsComponent,
    CreditBureauInfoComponent,
    AllBankDetailsComponent,
    PartnerInfoComponent,
    ContactPersonComponent,
    LoanDetailsBankValidation,
    SearchComponent,
    DedupeComponent,
    ApplicantComponent,
    PreSanctionDocsComponent,
    PostSanctionDocsComponent,
    PostDisbursementDocsComponent,
    PostBookingDocsComponent,
    LoanDocumentAccordionComponent,
    LoanDocumentAccordionItemComponent,
    LoanKycDocumentAccoridonComponent,
    DownloadLoanReportComponent,
    CustomConfirmationModalComponent,
    LoanStatusMenuComponent,
    DownloadLoanReportPopupComponent,
    FileUploadComponent,
    InputAlphaFieldComponent,
    LoanApprovalConfirmationPopupComponent,
    ProgressBarComponent,
    CustomDisplayPopupComponent,
    UploadReportsComponent,
    UploadReportPopupComponent,
    CustomErrorPopupComponent,
    CustomUploadDatePipe,
    BusinessRuleEngineComponent,
    BreReportComponent,
    DocTitleContainerComponent,
    TagDialogComponent,
    KiScoreReportComponent,
    LoanIncompleteReasonDialogComponent,
    LoanIncompleteReasonComponent,
    CustomToastMessageComponent,
    DedupeAccordionComponent,
    DedupesComponent,
    DedupeFormComponent,
    DedupeDataComponent,
    DedupeLoanSelectionComponent,
    CustomDatePipe,
    CustomMessageDisplayComponent,
    InsuranceDetailsComponent,
    KicreditReportsComponent,
    ReportsFilterComponent,
    ReportsDataComponent,
    SelectAllComboBoxComponent,
    KicreditUploadsComponent,
    UploadDataComponent,
    UploadFilterComponent,
    AdditionalTractorDetailsComponent,
    AtdReportComponent,
    ReportTableComponent,
    CamsSheetComponent,
    CamsReportComponent,
    CustomerCriteriaComponent,
    FieldVisitReferenceComponent,
    AddressFormatPipe,
    FinancialLiabilityDetailsComponent,
    CustomerAssetRequirementComponent,
    EligibilityCalculationComponent,
    BankFundingComponent,
    CamsSectionComponent,
    CreditFeedbackComponent,
    DeviationsComponent,
    ApprovalAuthorityComponent,
    FormatArrayToStringPipe,
    CommonReportsDownloadComponent,
    InputFieldComponent,
    DateFieldComponent,
    RadioButtonFieldComponent,
    NumberFieldComponent,
    LoanOverviewComponent,
    DynamicDataTransformPipe,
    ApplicantDetailsComponent,
    CoApplicantDetailsComponent,
    CoApplicantComponent,
    BorrowerDetailsComponent,
    KycResultsTableComponent,
    BreComponent,
    CurrencyPipe,
    ApplicantScorecardComponent,
    DynamicRenderComponent,
    SelectFieldComponent,
    AddressFieldComponent,
    AntiMoneyLaunderingComponent,
    AmlDetailsAccordionComponent,
    AmlHitTableComponent,
    FraudCheckComponent,
    FraudCheckReportComponent,
    LoanActivityComponent,
    ActivityCommentsComponent,
    ActivityHistoryComponent,
    ActivityAllComponent,
    AddCommentComponent,
    CommentComponent,
    HistoryActivityComponent,
    BeneficiaryCheckDetailsComponent,
    SetNewPasswordComponent,
    BorrowerBeneficiaryCheckComponent,
    BeneficiaryResponseDetailsComponent,
    CustomDatePipeCommonFormat,
    LoanApplicationSearchFilterComponent,
    LoanStageBreadcrumbsComponent,
    LoanStageDisplayComponent,
    MultiSelectSearchBoxComponent,
    LoanApplicationTableComponent,
    AssignToUserComponent,
    CreditBureauDataComponent,
    BeneficiaryResponseDetailsComponent,
    GroupTableComponent,
    DeviationsTableComponent,
    BusinessDataSheetComponent,
    SelectWithInputComponent,
    SelectWithSearchComponent,
    GroupInfoComponent,
    UserInactivityPopupComponent,
    KycDetailsComponent,
    KycDetailsAccordionComponent,
    LandAndCropComponent,
    CropInformationComponent,
    OtherIncomeDataComponent,
    OtherIncomeDetailsComponent,
    VehicleInsuranceDetailsComponent,
    BankFundingDetailsComponent,
    CbDataComponent,
    FiReportComponent,
    MfiCamReportComponent,
    MfiCamCustomerInfoComponent,
    MfiCamHouseholdProfileComponent,
    MfiCamHouseholdIncomeComponent,
    MfiCamOtherYearlyIncomeComponent,
    MfiCamRegularExpensesComponent,
    MfiCamIrregularExpensesComponent,
    CustomerDemandScheduleComponent,
    NotificationComponent,
    NotificationItemComponent,
    DedupeInfoComponent,
    DedupeInfoDetailsComponent,
    EkycSectionComponent,
    EkycDetailsSectionComponent,
    EkycImageComponent,
    MultiFilterComponent,
    CamsSectionComponent,
    HouseholdDetailsComponent,
    HouseholdInfoComponent,
    NomineeDetailsComponent,
    ApplicantFinancialLiabilitiesComponent,
    EkycTableComponent,
    EkycReportComponent,
    ConfirmationAlertsComponent,
    OccupationDetailsComponent,
    ErrorNotificationsItemComponent,
    CollateralMaintenanceVehicleComponent,
    SearchFilterComponent,
    GenerateReportPopupComponent,
    ReportTypeFieldComponent,
    LoanTypeFieldComponent,
    PartnerFieldComponent,
    ReportPurposeFieldComponent,
    DetailedDataEntryComponent,
    MfiIncomeDetailsComponent,
    ExpenseSectionComponent,
    SectionEditActionComponent,
    KiScoreAlertsComponent,
    CustomAlertsComponent,
    AddReworkDocumentComponent,
    ReworkDocumentsFormComponent,
    InsuranceDataComponent,
    MultiSelectChipComponent,
    TableHeaderMultiSelectComponent,
    DeviationDocumentsComponent,
    EligibilityRulesComponent,
    RecalculateBrePopupComponent,
    BreResultPopupComponent,
    RecalculateBreComponent,
    CustomProgressBarComponent,
    KycResultsUpdatePopupComponent,
    ApplicantDetailsKcplComponent,
    RepaymentScheduleTableComponent,
    TableDateFieldComponent,
    RepaymentTableInputFieldComponent,
    DemandScheduleDetailComponent,
    DocumentRejectReasonComponent,
    DocumentReviewStatusAlert,
    RepaymentScheduleTableComponent,
    TableDateFieldComponent,
    RepaymentTableInputFieldComponent,
    DemandScheduleDetailComponent,
    DeviationsRemarksInputComponent,
    ConfirmationPopupComponent,
    FileSuccessUploadPopupComponent,
    KiScoreUploadComponent,
    KiScoreResultsComponent,
    KiscoreDataUploadComponent,
    UploadKiscoreFileComponent,
    RepaymentScheduleTableComponent,
    TableDateFieldComponent,
    RepaymentTableInputFieldComponent,
    DemandScheduleDetailComponent,
    DeviationsRemarksInputComponent,
    FileSuccessUploadPopupComponent,
    HouseHoldIncomeExpenseComponent,
    LoanEligiblityComponent,
    BusinessIncomeExpenseComponent,
    HouseHoldProfileComponent,
    KicreditOverviewComponent,
    BusinessOnboardingComponent,
    BusinessReviewComponent,
    SupplierReferenceComponent,
    BusinessProfileDetailsComponent,
    BusinessRegistrationDetailsComponent,
    BusinessRegistrationDocumentsComponent,
    AuditComplianceDocumentsComponent,
    OtherBusinessDocumentsComponent,
    FactoringLimitComponent,
    BusinessKycDocumentsComponent,
    BusinessKycDetailsComponent,
    NationalIdDetailsComponent,
    BusinessKraComponent,
    BusinessOwnerKraComponent,
    BusinessDocumentComponent,
    BusinessDocumentItemComponent,
    BusinessReviewApprovePopupComponent,
    BusinessSectionActionButtonsComponent,
    SectionLevelRejectComponent,
    BusinessRegDetailItemComponent,
    BusinessAgreementComponent,
    SectionEditActionComponent,
    KiScoreAlertsComponent,
    CustomAlertsComponent,
    InsuranceDetailsComponent,
    InsuranceDataComponent,
    MultiSelectChipComponent,
    TableHeaderMultiSelectComponent,
    EligibilityRulesComponent,
    RecalculateBrePopupComponent,
    BreResultPopupComponent,
    RecalculateBreComponent,
    CustomProgressBarComponent,
    KycResultsUpdatePopupComponent,
    ApplicantDetailsKcplComponent,
    RepaymentScheduleTableComponent,
    TableDateFieldComponent,
    RepaymentTableInputFieldComponent,
    DemandScheduleDetailComponent,
    UserProfileComponent,
    LandingComponent,
    LoginFormComponent,
    PasswordInputComponent,
    TextInputComponent,
    NotifyMessageComponent,
    LoginPageButtonComponent,
    UserProfileNavigationComponent,
    UserProfileInfoComponent,
    ProfileInfoCardComponent,
    ChangePasswordComponent,
    FormComponent,
    LoginComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    ResetPasswordNotifyComponent,
    SetNewPasswordNotifyComponent,
    PasswordChangedNotifyComponent,
    PoweredByKaleidofinComponent,
    NeedHelpComponent,
    AccountTemporarilyBlockedNotifyComponent,
    CustomSuccessSnackBar,
    TrackSectionVisibilityDirective,
    TreeViewComponentComponent,
    DisableClipboardDirective,
    DisablePasteDirective,
    PanDocumentAccordionComponent,
    CommonDocumentAccordionComponent,
    LoanObligatorIncomeComponent,
    BreSubsectionsComponent,
    PercentageFormatPipe,
    UserAccessManagementComponent,
    StatusIndicatorComponent,
    AddNewUserDialogComponent,
    UserDetailsContainerComponent,
    UamRolesCheckboxGroupComponent,
    UserChangePasswordComponent,
    UamConfirmationPopupComponent,
    UamSearchFilterComponent,
    AmlAdverseMediaPopupComponent,
    CustomSnackbarComponent,
    UploadedDocumentsComponent,
    DocumentViewerComponent,
    InfoTooltipComponent,
    DedupeCheckPopupComponent
  ],
  entryComponents: [
    LoanApplicationReviewDialogComponent,
    LoanApplicationReviewRejectDialogComponent,
    LoanDetailsBankValidation,
    LoanApplicationReviewAcceptDialogComponent,
    ErrorNotificationsItemComponent,
  ],
  providers: [
    KCreditService,
    LoanReviewService,
    ReportGenerationService,
    LoanReviewPopupService,
    ImportDataService,
    FileService,
    KcreditLoanService,
    KcreditLoanResolve,
    KaleidoCreditResolvePagingParams,
    CustomValidator,
    //External Services
    SubscriptionReviewService,
    PartnersService,
    UpdatedSubscriptionDataService,
    CustomerService,
    RejectReasonPipe,
    SubscriptionReviewPopupService,
    ImageEditorPopupService,
    SubscriptionReviewSupportService,
    SubscriptionReviewModelService,
    KcreditInterDataService,
    ProductCodeService,
    CreditBureauService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SingleTenancyInterceptor,
      multi: true,
      deps: [Injector, JhiEventManager, CustomValidator],
    },
  ],
  exports: [SharedLibModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class KaleidoCreditModule {}
