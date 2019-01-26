import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filesize'
})
export class FilesizePipe implements PipeTransform {
    private units = [
        'bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB'
    ];

    transform(bytes = null, precision: number = 2): any {
        if (bytes === null || bytes === '') {
            return '';
        }

        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
            return '?';
        }

        let unit = 0;

        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }

        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    }
}
