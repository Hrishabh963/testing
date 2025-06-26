import { Component, OnInit, Input } from "@angular/core";
import { get } from "lodash";

@Component({
  selector: "app-post-booking-docs",
  templateUrl: "./post-booking-docs.component.html",
  styleUrls: ["./post-booking-docs.component.scss"],
})
export class PostBookingDocsComponent implements OnInit {
  @Input() loanDetailDocuments: any[];
  @Input() loanId: any;
  @Input() partnerId: any;
  panelOpenState: boolean = false;
  documentTypes: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.documentTypes = Object.keys(this.loanDetailDocuments|| {});
    this.panelOpenState = get(this.documentTypes, "length", 0) > 0;
  }
}
