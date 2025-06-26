import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "percentageFormat",
})
export class PercentageFormatPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return '--';
    }
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
      return '--';
    }

    const formattedValue = numericValue % 1 === 0
      ? numericValue 
      : parseFloat(numericValue.toFixed(6)); 

    return `${formattedValue}%`;
  }
}

