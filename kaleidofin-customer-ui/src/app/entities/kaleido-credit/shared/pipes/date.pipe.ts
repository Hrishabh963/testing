import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "date",
})
export class CustomDatePipeCommonFormat implements PipeTransform {
  constructor() {}

  transform(date: Date | string, format: string = "yyyy-MM-dd, HH:mm"): string {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return date as string;
    }
    return new DatePipe("en-US").transform(parsedDate, format);
  }
}
