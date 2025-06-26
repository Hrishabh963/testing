import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
import { get } from "lodash";

@Pipe({
  name: "dedupeCustomDate",
})
export class CustomDatePipe implements PipeTransform {
  transform(date: any, format: string = "yyyy-MM-dd"): string {
    if (!date) {
      return "---";
    } else if (date instanceof Object) {
      return `${get(date, "day", "")}-${get(date, "month", "")}-${get(
        date,
        "year",
        ""
      )}`;
    }
    return new DatePipe("en-US").transform(date, format);
  }
}
