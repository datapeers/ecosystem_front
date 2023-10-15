import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'className'
})
export class ClassNamePipe implements PipeTransform {
  transform(input: { [key: string]: boolean }): string {
    if (!input) return '';

    return Object.entries(input)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .join(' ');
  }
}