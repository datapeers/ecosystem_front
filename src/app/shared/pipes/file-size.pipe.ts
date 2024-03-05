import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0 MB';
    }

    const megabytes = value / (1024 * 1024);
    return megabytes.toFixed(2) + ' MB';
  }
}
