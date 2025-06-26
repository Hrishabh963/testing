import { Component } from "@angular/core";

@Component({
  selector: "app-audit-compliance-documents",
  templateUrl: "./audit-compliance-documents.component.html",
  styleUrls: ["../business-review-details.scss"],
})
export class AuditComplianceDocumentsComponent {
  documents = [
    {
      categoryLabel: "Audited financial statements",
      category: "Audit Financial Statements",
      types: [
        {
          typeLabel: "Audited financial statements",
          type: "AuditFinancialStatement",
        },
      ],
    },
    {
      categoryLabel: "Tax file",
      category: "Tax File",
      types: [
        {
          typeLabel: "Tax file",
          type: "TaxFile",
        },
      ],
    },
    {
      categoryLabel: "Compliance certificate",
      category: "Compliance Certificate",
      types: [
        {
          typeLabel: "Certificate of compliance",
          type: "ComplianceCertificate",
        },
      ],
    },
    {
      categoryLabel: "Old invoices",
      category: "Old Invoices",
      types: [
        {
          typeLabel: "Old invoices",
          type: "OldInvoices",
        },
      ],
    },
  ];
}
