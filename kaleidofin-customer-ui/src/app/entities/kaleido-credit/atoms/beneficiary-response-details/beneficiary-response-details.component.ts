import { Component, Input} from '@angular/core';

@Component({
  selector: "app-beneficiary-response-details",
  templateUrl: "./beneficiary-response-details.component.html",
  styleUrls: ["./beneficiary-response-details.component.scss"],
})
export class BeneficiaryResponseDetailsComponent{
  @Input() uiFields: any = {};

  uiFieldsMap: any[] = [
    { 
      label: "Time Stamp", 
      propertyKey: "timestamp" 
    },
    { 
      label: "Status", 
      propertyKey: "status" 
    },
    { 
      label: "Message", 
      propertyKey: "message" 
    },
    { 
      label: "Error Description", 
      propertyKey: "errorDescription" 
    },
    {
      label: "Remitter Available Balance",
      propertyKey: "remitterAvailableBalance",
    },
    {
      label: "Remitter Reference Number",
      propertyKey: "remitterReferenceNumber",
    },
    {
      label: "Retrieval Reference Number",
      propertyKey: "retrievalReferenceNumber",
    },
    { 
      label: "Transaction Date", 
      propertyKey: "transactionDate" 
    },
    { 
      label: "Beneficiary Name", 
      propertyKey: "beneficiaryName" 
    },
    {
      label: "Beneficiary Account Number",
      propertyKey: "beneficiaryAccntNumber",
    },
  ];
  constructor() {}

}
