import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomUploadDatePipe implements PipeTransform {

  transform(value: string): string {
    const datePipe = new DatePipe('en-US');
    const date = new Date(value);

    const formattedDate = datePipe.transform(date, 'HH:mm dd MMM');

    return formattedDate || '';
  }
}
