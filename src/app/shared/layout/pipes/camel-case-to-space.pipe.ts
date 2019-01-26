import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'camelCaseToSpace'
})
export class CamelCaseToSpacePipe implements PipeTransform {
    transform(value: string, args?: any): any {
        return value.replace(/([A-Z])/g, ' $1');
    }
}
