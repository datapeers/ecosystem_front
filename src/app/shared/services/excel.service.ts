import { Injectable } from '@angular/core';
import { Column, Workbook } from 'exceljs';
import FileSaver from 'file-saver';
import { Buffer } from 'buffer';
import { TableExportFormats } from '@shared/components/dynamic-table/models/table-export-formats.enum';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  blobOptions: Record<TableExportFormats, BlobPropertyBag> = {
    [TableExportFormats.csv]: { type: 'text/csv;charset=UTF-8' },
    [TableExportFormats.xlsx]: { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }
  }

  constructor() { }

  buildWorkbook(columns: Partial<Column>[], rows: any[]) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('data');
    worksheet.columns = columns;
    worksheet.addRows(rows);
    return workbook;
  }
  
  getWorkbookBuffer(workbook: Workbook, format: TableExportFormats) {
    switch (format) {
      case TableExportFormats.csv: return workbook.csv.writeBuffer();
      case TableExportFormats.xlsx:  return workbook.xlsx.writeBuffer();
    }
  }

  downloadBase64Buffer(base64WorkbookBuffer: string, fileName: string, format: TableExportFormats = TableExportFormats.xlsx) {
    const buf = Buffer.from(base64WorkbookBuffer, 'base64');
    this.saveFile(buf, fileName, format);
  }

  saveFile(buffer: any, fileName: string, fileFormat: TableExportFormats): void {
    const data: Blob = new Blob([buffer], this.blobOptions[fileFormat]);
    FileSaver.saveAs( data, `${fileName}${new Date().toLocaleDateString()}.${fileFormat}`);
  }

  downloadFromData(fileName: string, columns: Partial<Column>[], rows: any[], format: TableExportFormats) {
    return new Promise((resolve, reject) => {
      const workbook = this.buildWorkbook(
        columns,
        rows,
      );
      this.getWorkbookBuffer(workbook, format)
      .then((workbookData) => {
        this.saveFile(workbookData, fileName, format);
        resolve(true);
      })
      .catch((reason) => {
        reject(reason);
      });
    }) 
  }

  convertLetterToNumber(str:string) {
    str = str.toUpperCase();
    let out = 0, len = str.length;
    for (let pos = 0; pos < len; pos++) {
      out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - pos - 1);
    }
    return out;
  }

  convertNumberToLetter(num:number) {
    let letters = '';
    while (num >= 0) {
        letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters
        num = Math.floor(num / 26) - 1
    }
    return letters;
  }


}
