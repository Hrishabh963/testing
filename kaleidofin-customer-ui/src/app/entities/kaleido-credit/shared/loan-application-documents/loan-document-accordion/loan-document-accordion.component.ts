import {
  Component,
  OnInit,
  Input,
} from "@angular/core";
import { get, isEmpty } from "lodash";

@Component({
  selector: "app-loan-document-accordion",
  templateUrl: "./loan-document-accordion.component.html",
  styleUrls: ["./loan-document-accordion.component.scss"],
})
export class LoanDocumentAccordionComponent implements OnInit {
  @Input() documentData: any;
  @Input() title: string = "";
  @Input() loanId: any;
  @Input() partnerId: any;
  @Input() sectionAuthority:string = ""
  panelOpenState = false;

  subtypeList: any[] = [];

  constructor() {}

  ngOnInit(): void {
    if (this.documentData) {
      if (Array.isArray(this.documentData)) {
        this.subtypeList = this.documentData;
      } else {
        this.subtypeList = Object.keys(this.documentData);
      }
    }
  }

  getFileData(subtype: any) {
    if (!Array.isArray(this.documentData)) {
      let documentTypes = this.documentData[subtype];
      if (documentTypes && Array.isArray(documentTypes)) {
        return documentTypes;
      } else if (!isEmpty(documentTypes)) {
        console.log(this.documentData, subtype, "Sub", documentTypes);
        return Object.values(documentTypes)
          .map((z) => get(z, "items", null))
          .flat();
      }
    }
    return [];
  }

  updateAccordionOpenState(){
    this.panelOpenState = true
  }
  updateAccordionCloseState(){
    this.panelOpenState = false
  }
}
