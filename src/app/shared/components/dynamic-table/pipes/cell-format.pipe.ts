import { Pipe, PipeTransform } from '@angular/core';
import { TableColumn } from '../models/table-config';
import { CurrencyPipe } from '@angular/common';
import moment from 'moment';

@Pipe({
  name: 'cellFormat'
})
export class CellFormatPipe implements PipeTransform {
  constructor(private readonly currencyPipe: CurrencyPipe) {}

  transform(value: any | any[], args: TableColumn): string {
    if (Array.isArray(value)) {
      return value.map((v) => this.applyFormat(v, args)).join(', ');
    }
    return this.applyFormat(value, args);
  }

  applyFormat(value: any, config: TableColumn): string {
    if (
      config.format !== 'boolean' &&
      (value === '' || value === null || value === undefined)
    ) {
      return '';
    }
    switch (config.format) {
      default:
        return value;
      case 'date':
        return moment(new Date(value)).format('yyyy-MM-DD');
      case 'dateAndTime':
        return moment(new Date(value)).format('DD-M-yy, h:mm a');
      case 'time':
        return moment(new Date(value)).format('h:mm a');
      case 'boolean':
        const booleanText = config.booleanText ?? { true: 'Si', false: 'No' };
        return value ? booleanText.true : booleanText.false;
      case 'currency':
        return this.currencyPipe.transform(
          value,
          'CAD',
          'symbol-narrow',
          '4.0'
        );
    }
  }
}
