import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-common-document-accordion',
  templateUrl: './common-document-accordion.component.html',
  styleUrls: ['./common-document-accordion.component.scss']
})
export class CommonDocumentAccordionComponent  {

  @Input() documentTypes: Array<any> = [];
  @Input() panDocuments: Array<any> = [];
  @Input() loanDetailDocuments: any = {};
  @Input() authority: string = null;
  @Input() partnerId: number = null;
  @Input() customerId: number = null;
  @Input() loanId: number = null;
  
}
