import { Pipe, PipeTransform } from "@angular/core";
import { AddressFormatPipe } from "./address-format.pipe";
import { CustomDatePipeCommonFormat } from "./date.pipe";
import { CurrencyPipe } from "./currency.pipe";
import { PercentageFormatPipe } from "../percentage-format.pipe";

@Pipe({
  name: "dynamicDataTransform",
})
export class DynamicDataTransformPipe implements PipeTransform {
  transform(value: any, pipeName: string, format: string): any {
    if (pipeName && value != null) {
      const pipe = new (this.getPipe(pipeName))();
      return pipe.transform(value, format);
    }
    return value;
  }

  private getPipe(pipeName: string): any {
    switch (pipeName) {
      case "currency":
        return CurrencyPipe;
      case "addressFormat":
        return AddressFormatPipe;
      case "date":
        return CustomDatePipeCommonFormat;
      case "percentage":
        return PercentageFormatPipe
      default:
        console.warn(`Pipe ${pipeName} not supported.`);
        return null;
    }
  }
}
