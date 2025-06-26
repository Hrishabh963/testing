import { Component, Input } from "@angular/core";

@Component({
  selector: "app-ekyc-table",
  templateUrl: "./ekyc-table.component.html",
  styleUrls: ["./ekyc-table.component.scss"],
})
export class EkycTableComponent {
  @Input() kycData: any = {};

  showDetail: boolean = true;

  tableRow: Array<any> = [
    { label: "Name", propertyKey: "name" },
    { label: "DOB", propertyKey: "dob" },
    { label: "Gender", propertyKey: "gender" },
    { label: "Careof (C/O)", propertyKey: "careof" },
    { label: "Address", propertyKey: "address" },
    { label: "Locality", propertyKey: "locality" },
    { label: "District", propertyKey: "district" },
    { label: "State", propertyKey: "state" },
    { label: "Pin code", propertyKey: "pincode" },
    { label: "Post Office", propertyKey: "postoffice" },
    { label: "Country", propertyKey: "country" },
  ];

  getMatchValue(matchValue: boolean | null): string {
    const a = matchValue ? "Match" : "Not Match";
    return matchValue === null ? "--" : a;
  }

  getMatchClass(matchValue: boolean | null): string {
    const a = matchValue ? "match" : "not-match";
    return matchValue === null ? "" : a;
  }
}
