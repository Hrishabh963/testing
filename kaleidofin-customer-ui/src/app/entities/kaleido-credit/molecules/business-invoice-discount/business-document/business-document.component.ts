import { Component, Input, OnInit } from "@angular/core";
import { getProperty } from "src/app/utils/app.utils";

@Component({
  selector: "app-business-document",
  templateUrl: "./business-document.component.html",
  styleUrls: ["./business-document.component.scss"],
})
export class BusinessDocumentComponent implements OnInit {
  @Input() data: any = {};
  @Input() category: any = "";

  documentTypes: any = {};
  constructor() {}

  ngOnInit(): void {
    this.documentTypes = getProperty(this.data, "types", []);
  }
}
