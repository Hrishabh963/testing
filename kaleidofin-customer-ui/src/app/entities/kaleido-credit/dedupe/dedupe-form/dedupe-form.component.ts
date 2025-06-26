import { Input, Component, OnInit } from "@angular/core";
import { differenceInYears, isValid, parse } from "date-fns";
import { get, isEmpty } from "lodash";
import { CoApplicantKycDetail } from "../../models/kyc-details.model";

@Component({
  selector: "app-dedupe-form",
  templateUrl: "./dedupe-form.component.html",
  styleUrls: ["./dedupe-form.component.scss"],
})
export class DedupeFormComponent implements OnInit {
  @Input() data: any = null;
  @Input() paramsObject: Record<string, string> = {};
  addressInfo: string = "";

  constructor() {}

  ngOnInit(): void {
    this.addressInfo = this.fetchAddressInformation(this.data);
  }

  fetchAddressInformation(addressDTO: any = {}) {
    if (isEmpty(addressDTO)) {
      return "---";
    }
    let addressObject = {
      address1: get(addressDTO, "address1"),
      address2: get(addressDTO, "address2"),
      city: get(addressDTO, "city"),
      district: get(addressDTO, "district"),
      state: get(addressDTO, "state"),
      pincode: get(addressDTO, "pincode"),
    };
    const propertiesToInclude = [
      addressObject.address1,
      addressObject.address2,
      addressObject.city,
      addressObject.district,
      addressObject.state,
      addressObject.pincode,
    ];

    const addressString = propertiesToInclude
      .filter((property) => property !== null && property !== undefined)
      .join(",");

    return addressString;
  }

  getAge(data: any = {}): number | string {
    const dobInput = data?.dateOfBirth;
    if (!dobInput) return "---";

    let dob: Date | null = null;

    if (typeof dobInput === "string") {
      dob = parse(dobInput, "yyyy-MM-dd", new Date());
    } else if (
      typeof dobInput === "object" &&
      dobInput.day &&
      dobInput.month &&
      dobInput.year
    ) {
      const { day, month, year } = dobInput;
      const formatted = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      dob = parse(formatted, "yyyy-MM-dd", new Date());
    }

    if (!dob || !isValid(dob)) return "---";

    return differenceInYears(new Date(), dob);
  }

  getNumberFromKycDocs(docType: string): string | number | null {
    const kycDocs: CoApplicantKycDetail[] = get(this.data, "kycDocuments", []);
    if (!Array.isArray(kycDocs) || !docType?.trim()) return null;

    const match = kycDocs.find((doc) =>
      doc?.documentType?.toLowerCase().includes(docType.toLowerCase())
    );

    return match?.idNo ?? null;
  }
}
