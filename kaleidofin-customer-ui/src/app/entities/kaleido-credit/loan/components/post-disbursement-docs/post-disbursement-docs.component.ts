import { Component, Input, OnInit } from "@angular/core";
import { get } from "lodash";
import { AUTHORITES } from "../../../constants/authorization.constants";

@Component({
  selector: "app-post-disbursement-docs",
  templateUrl: "./post-disbursement-docs.component.html",
  styleUrls: ["./post-disbursement-docs.component.scss"],
})
export class PostDisbursementDocsComponent implements OnInit {
  @Input() loanDetailDocuments: any[];
  @Input() partnerId: any;
  @Input() loanId: any;
  panelOpenState:boolean = false;
  documentTypes: any[] = [];
  authority = AUTHORITES.UNDERWRITINGSCREEN_POSTDISBURSEMENTREJECT;
  constructor() {}

  ngOnInit(): void {
    this.documentTypes = Object.keys(this.loanDetailDocuments || {});
    this.panelOpenState = get(this.documentTypes, "length", 0) > 0;
  }
}
