import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'rejectReasonPipe'})
export class RejectReasonPipe implements PipeTransform {
    transform(items: any, field1: string, field2: string, field3?: string, field4?: string): any {
        const list = [];
        if (field4 === null || field4 === undefined) {
            field4 = undefined;
        }
        items.forEach(value => {
            if (value.field4 === null || value.field4 === undefined) {
                value.field4 = undefined;
            }
            if (value.field1 === field1 && value.field2 === field2 && value.field3 === field3 && value.field4 === field4) {
                list.push({ id: value.code, name: value.name });
            }
        });
        return list;
    }
}
