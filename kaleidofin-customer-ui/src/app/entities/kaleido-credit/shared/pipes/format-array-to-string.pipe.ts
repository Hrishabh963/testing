import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatArrayToString'
})
export class FormatArrayToStringPipe implements PipeTransform {

  transform(array:Array<any> = []): unknown {
    return array.join(',');
  }

}
