import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "addressFormat",
})
export class AddressFormatPipe implements PipeTransform {
  transform(addressObject: any): string {
    if (!addressObject) {
      return "";
    }

    const parts: Array<any> = [
      addressObject.address1,
      addressObject.address2,
      addressObject.city,
      addressObject.district,
      addressObject.state,
      addressObject.pincode,
    ];

    // Filter out null, undefined values or empty stringss and join with commas
    const formattedAddress = parts
      .filter((part) => part)
      .join(", ");

    return formattedAddress || "--";
  }
}
