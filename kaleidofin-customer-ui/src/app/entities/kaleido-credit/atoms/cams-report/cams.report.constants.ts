export const FIELD_MAPS = {
  fieldVisitReference: [
    { label: "Name", propertyKey: "reference" },
    { label: "Contact No", propertyKey: "contactNo" },
    { label: "Relation with applicant", propertyKey: "relationShip" },
    { label: "Feedback of Reference", propertyKey: "feedBackOfReference" },
    {
      label: "No of years of knowing the borrower",
      propertyKey: "noOfYearsKnowingOfBorrower",
    },
    { label: "Credit Comments", propertyKey: "creditComments" },
  ],
  financeLiability: [
    {
      label: "Bank/Financial Institution",
      propertyKey: "bankOrFinancialInstitution",
    },
    { label: "Type of Loan", propertyKey: "typeOfLoan" },
    { label: "Purpose of Loan", propertyKey: "purposeOfLoan" },
    { label: "Loan Amount", propertyKey: "loanAmount" },
    { label: "MOB", propertyKey: "mob" },
    { label: "O/S as on date", propertyKey: "osAsOnDate" },
    { label: "Annual Obligation", propertyKey: "annualObligation" },
    {
      label: "A/C Behaviour, AD/PD or Details to be mentioned",
      propertyKey: "accountBehaviour",
    },
  ],
  assetDetails: [
    { label: "Items", propertyKey: "items" },
    { label: "Number of Units", propertyKey: "numberOfUnits" },
    {
      label: "Product Norm for Reference",
      propertyKey: "productNormForReference",
    },
    { label: "Asset Cost", propertyKey: "assetCost" },
    { label: "Bank Funding", propertyKey: "bankFunding" },
    { label: "Customer Equity", propertyKey: "customerEquity" },
    { label: "Criteria", propertyKey: "criteria" },
    {
      label: "Details of Criteria being met",
      propertyKey: "detailsOfCriteriaBeingMet",
    },
  ],
  assetInformation: [
    { label: "Product Type", propertyKey: "productType" },
    { label: "Manufacture", propertyKey: "manufacturer" },
    { label: "Model", propertyKey: "model" },
    { label: "Model Variant", propertyKey: "modelVariant" },
    { label: "Dealer/DSA/DFA Code", propertyKey: "dealerOrDSAOrDFACode" },
    { label: "Dealer/DSA/DFA Name", propertyKey: "dealerOrDSAOrDFAName" },
    { label: "HP (Horsepower)", propertyKey: "horsePower" },
    { label: "Date of Manufacturing", propertyKey: "manufacturingDate" },
    { label: "Model category", propertyKey: "modelCategory" },
    { label: "Implement Name", propertyKey: "implementName" },
    {
      label: "Implement Manufacturer",
      propertyKey: "implementManufacturer",
    },
    { label: "Product Scheme", propertyKey: "productScheme" },
    { label: "Age of Asset (In Year)", propertyKey: "ageOfAsset" },
    { label: "Engine No", propertyKey: "engineNumber" },
    { label: "Registration Number Name", propertyKey: "registrationNumber" },
    { label: "Chassis No", propertyKey: "chassisNumber" },
    { label: "IDV", propertyKey: "idv" },
    { label: "Vehicle Grade", propertyKey: "vehicleGrade" },
  ],
  rmVisitReports: [
    {
      label: "Confirmation of critical checks at visit time",
      propertyKey: "criticalChecksConfirmation",
    },
    {
      label: "Tractor in running condition",
      propertyKey: "tractorInRunningCondition",
    },
    {
      label: "Tractor service centre feedback",
      propertyKey: "tractorServiceCenterFeedback",
    },
    {
      label: "Photo of tractor with customer",
      propertyKey: "photoOfTractorWithCustomer",
    },
  ],
  fundingEligibility: [
    {
      label: "Funding on Tractor requested by borrower",
      propertyKey: "fundingRequestByBorrower",
    },
    {
      label: "Price of the Vehicle (As per Valuation Report",
      propertyKey: "vehiclePrice",
    },
    {
      label: "Depriciated price of the Vehicle (DCB Internal Grid)",
      propertyKey: "depreciatedVehiclePrice",
    },
    { label: "Eligible LTV", propertyKey: "eligibleLTV" },
    { label: "Eligible Loan Amount", propertyKey: "eligibleLoanAmount" },
    { label: "Requested LTV", propertyKey: "requestedLTV" },

    { label: "Final LTV", propertyKey: "finalLTV" },
    {
      label:
        "Funding amount on tractor = Final LTV*Lower of VALUATION/DEPRECIATED PRICE",
      propertyKey: "fundingAmount",
    },
    { label: "Criteria", propertyKey: "criteria" },
    {
      label: "Details of Criteria being met",
      propertyKey: "detailsOfCriteriaBeingMet",
    },
  ],
  vehicleLoans: [
    {
      label: "Vehicle Registration Cost",
      propertyKey: "vehicleRegistrationCost",
    },
    {
      label: "Vehicle Insurance Tenor",
      propertyKey: "vehicleRegistrationTenure",
    },
    {
      label: "Vehicle Insurance Premium Amount",
      propertyKey: "vehicleInsurancePremiumAmount",
    },
    {
      label: "Loan Cover Insurance Tenor",
      propertyKey: "loanCoverInsuranceTenure",
    },
    {
      label: "Loan Cover Insurance Premium Amount",
      propertyKey: "loanCoverInsurancePremiumAmount",
    },
    { label: "Health Insurance Tenor", propertyKey: "healthInsuranceTenure" },
    {
      label: "Health Insurance  Premium Amount",
      propertyKey: "healthInsurancePremiumAmount",
    },
    { label: "Total Bank Funding", propertyKey: "totalBankFunding" },
    { label: "Customer Equity", propertyKey: "customerEquity" },
  ],
  finalIncome: {
    "Total Annual Income": "totalAnnualIncome",
    "Total Annual EMI Obligation": "totalAnnualEmiObligation",
    "Annual Gross Income to Instalment Ratio":
      "annualGrossIncomeToInstallmentRatio",
  },
  otherIncomeSources: {
    "Other Income Type": "otherIncomeType",
    "Income Category (Doc/Undoc)": "incomeCategory",
    "Type of Proof (Documented)": "documented",
    "Type of Proof (Undocumented)": "unDocumentedIncome",
    "Description details of other Income source":
      "describeDetailsOfUndocumentedActivities",
    "Gross Income": "grossIncome",
    "Net Income": "netIncome",
  },
  agriculturalIncome: {
    "Crop Type": "cropType",
    "Crop Name": "cropName",
    "Land Area": "landAreaUnderCultivation",
    "Yeild in Quintal/Acre": "yeildInQuintal",
    "Sowing Month": "sowingMonth",
    "Harvest Month": "harvestingMonth",
  "Price Recieved per Quintal": "priceReceivedPerQuintal",
    "Gross Income": "netIncome",
  },
  bankFundingDetails: {
    "Loan amount on tractor": "totalLoanAmount",
    "Vehicle Insurance Premium Amount": "vehicleInsurancePremiumAmount",
    "Loan Cover Insurance Premium Amount": "loanCoverInsurancePremiumAmount",
    "Health Insurance Premium Amount": "healthInsurancePremiumAmount",
    "Total Loan Amount": "totalLoanAmount",
    IRR: "irr",
    "Vehicle Insurance Tenure": "vehicleInsuranceTenure",
    "Loan Cover Insurance Tenure": "loanCoverTenure",
    "Health Insurance Tenor": "healthInsuranceTenure",
    "Processing Fees": "processingFee",
    "Frequency of Payment of total loan amount": "paymentFrequency",
    "Installment Value": "installmentValue",
    "Annual Installment": "annualInstallmentAmount",
    Tenure: "tenure",
    "Maximum Installment Nos/year": "maximumInstallmentPerYear",
    "PDC / NPDC/CASH COLLECTION/ECS/NACH/SI": "pdcOrNpdcOrCashCollectionOrEcs",
    LTV: "ltv",
  },
  tractorDetails: {
    "Product Type": "loanType",
    Manufacturer: "manufacturer",
    Model: "model",
    "Model Variant": "modelVariant",
    "Dealer/DSA/DFA Code": "dealerCode",
    "Dealer Name": "dealerName",
    "HP (Horse Power)": "horsePower",
    "Date of Manufacturing": "yearOfManufacturer",
    "Model Category": "assetCategoryAsPerState",
    "Implement Name": "implementName",
    "Implement Manufacturer": "implementManufacturer",
  },
  fundingDetails: {
    "Funding on Tractor Requested by Borrower":
      "fundingOnTractorRequestedByBorrower",
    "Price of the Vehicle(As per Dealer Quotation":
      "priceOfTheVehicleAsPerDealerQuotation",
    "Price of the Vehicle(DCB Internal Price)": "priceOfTheVehicle",
    "Eligible LTV": "eligibleLtv",
    "Eligible Loan Amount": "eligibleLoanAmount",
    "Requested LTV": "requestedLtv",
    "Final LTV": "finalLtv",
    "Funding amount on tractor = Final LTV* Lower of quotation price/Internal price":
      "fundingAmountOnTractor",
    "Implement Loan Amount requested by borrower":
      "implementLoanAmountRequestedByBorrower",
    "Implement Cost / Quotation price": "implementCost",
    "Eligible LTV(From BRE)": "implementEligibleLtv",
    "Funding amount on Implement © = Final LTV* quotation price":
      "fundingAmountOnImplement",
    "Total Margin in the Project (Based on DCB Pricing)":
      "totalMarginInTheProject",
    "Total Bank Funding": "totalBankFunding",
    "Instalment Pattern": "installmentPattern",
    "Tenure (In Months)": "tenure",
    "Processing Fees (%)": "processingFees",
    "PDC/NPDC/CASHCollection/ECS/NACH/SI": "pdcOrNpdcOrCashCollectionOrEcs",
    "Total Installment per Year (RS.) for staggered installments the year with the highest annual installment is to be considered":
      "totalInstallmentPerYear",
    "Rate of Interest to Customer (Reducing Balance)":
      "rateOfInterestToCustomer",
    "Maximum Installment Value": "maximumInstallmentValue",
    "Date of Delivery of Asset (DD-MM-YYYY)": "dateOfDeliveryOfAsset",
    "Advancing Period & Meter Reading": "advancingPeriodAndMeterReading",
  },
};
