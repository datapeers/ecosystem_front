import { Injectable } from '@angular/core';
import { GraphqlService } from '@graphqlApollo/graphql.service';
import { map, tap } from 'rxjs/operators';
import { Observable, firstValueFrom } from 'rxjs';
import { AppForm, IForm } from './models/form';
import formQueries from './form.gql';
import { FormCollections } from './enums/form-collections';
import { IFormSubscription } from './models/form-subscription';
import { FormRendererComponent } from './form-renderer/form-renderer.component';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { CreateSubscriptionArgs as CreateSubscriptionInput } from './models/create-subscription.input';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private readonly graphql: GraphqlService,
    private readonly dialogService: DialogService,
  ) {}

  getForm(id: string): Promise<AppForm> {
    const refQuery = this.graphql.refQuery(
      formQueries.query.form,
      { id },
      'no-cache',
      { auth: false }
    );
    return firstValueFrom(
      this.graphql.query(refQuery)
      .pipe(
        map((request) => request.data.form),
        map((form) => AppForm.fromJson(form))
      )
    );
  }

  getFormByCollection(targetCollection: FormCollections): Promise<AppForm> {
    const refQuery = this.graphql.refQuery(
      formQueries.query.forms,
      { target: targetCollection },
      'no-cache',
      { auth: false }
    );
    return firstValueFrom(
      this.graphql.query(refQuery)
      .pipe(
        map((request) => request.data.forms),
        map((form) => AppForm.fromJson(form))
      )
    );
  }

  updateFormKeys(id: string, keys: string[]) {
    return this.updateForm(id, { keys });
  }

  private updateForm(id: string, data: Partial<IForm>): Promise<AppForm> {
    data._id = id;
    const refMutation = this.graphql.refMutation(
      formQueries.mutation.updateForm,
      { updateFormInput: data },
      [],
      { auth: true },
    );
    return firstValueFrom(
      this.graphql.mutation(refMutation)
      .pipe(
        map((request) => request.data.updateForm),
        map((form) => AppForm.fromJson(form))
      )
    );
  }

  createFormSubscription(args: CreateSubscriptionInput): Promise<AppForm> {
    const refMutation = this.graphql.refMutation(
      formQueries.mutation.createFormSubscription,
      { createFormSubscriptionInput: args },
      [],
      { auth: true },
    );
    return firstValueFrom(
      this.graphql.mutation(refMutation)
      .pipe(
        map((request) => request.data.createFormSubscription),
      )
    );
  }

  closeFormSubscription(id: string): Promise<IFormSubscription> {
    const refMutation = this.graphql.refMutation(
      formQueries.mutation.closeFormSubscription,
      { id },
      [],
      { auth: false }
    );
    return firstValueFrom(
      this.graphql.mutation(refMutation)
      .pipe(
        map((request) => request.data.closeFormSubscription),
      )
    );
  }

  listenFormSubscription(id: string): Observable<IFormSubscription> {
    return this.graphql.subscribeRequest(formQueries.subscription.listenFormSubscription, { id })
    .pipe(
      map((request) => request.data.listenFormSubscription),
      tap((data) => {
        console.log(data);
      })
    );
  }

  openFormFromSubscription(idSubscription: string, title: string = "Formulario") {
    this.dialogService.open(FormRendererComponent, {
      modal: true,
      width: '95%',
      height: '100vh',
      data: {
        idSubscription,
        iframe: `${environment.forms}form/renderer/${idSubscription}`,
      },
      header: title,
      showHeader: true,
    });
  }

  // //TODO: MOVE THIS METHOD TO LET THE BACKEND MANAGE THE CREATION OF THE EXCEL FILE
  // async downloadFormAsExcel(worksheetname: string, columns: IFormColumn[]) {
  //   //Creates a new workbook
  //   const workbook = new Workbook();
  //   //Creating a new worksheet using the table title (title translation comes from component using the table)
  //   //templateName needs to be translated if required
  //   const templateName = 'Plantilla';
  //   const worksheet = workbook.addWorksheet(`${templateName} ${worksheetname}`);
  //   //Getting form components from database
  //   worksheet.columns = columns.map((col) => {
  //     return { header: col.label, width: col.label.length + 3 };
  //   });
  //   let blankRow = columns.map((col) => '');
  //   for (let index = 0; index < 1000; index++) {
  //     worksheet.addRow(blankRow);
  //   }
  //   let columnConfig = columns.map((col) => col.config ?? {});
  //   let validationSheet = workbook.addWorksheet(`validation`, {
  //     state: 'veryHidden',
  //   });
  //   //creating validation sheet
  //   let rows = validationSheet.addRows(
  //     columnConfig.map((column) => column['dataValidation']?.formulae ?? [])
  //   );
  //   rows.forEach((row, index) => {
  //     if (row.actualCellCount > 0) {
  //       let sheet = '=validation!';
  //       let address =
  //         '$A$' +
  //         (index + 1).toString() +
  //         ':$' +
  //         this.excelService.convertNumberToLetter(row.actualCellCount - 1) +
  //         '$' +
  //         (index + 1).toString();
  //       let rangeReference = `${sheet}${address}`;
  //       columnConfig[index].dataValidation.formulae = [`${rangeReference}`];
  //     }
  //   });
  //   columnConfig.forEach((column, index) => {
  //     worksheet.getColumn(index + 1).eachCell((cell, rowNumber) => {
  //       if (rowNumber > 1)
  //         Object.keys(column).forEach((key) => {
  //           cell[key] = column[key];
  //         });
  //     });
  //   });
  //   await workbook.xlsx.writeBuffer().then((data) => {
  //     this.excelService.saveFile(
  //       data,
  //       `${worksheetname}_table_vinku_`,
  //       FileFormats.XLSX
  //     );
  //   });
  // }

  // parseDataFromComponents(
  //   components: FormAppComponent[],
  //   data,
  //   parseAsArray: boolean = false
  // ) {
  //   let outputData = {};
  //   // const usefulComponents = components.filter((comp) => comp.type != 'button');
  //   components.forEach((comp) => {
  //     switch (comp.type) {
  //       default:
  //         outputData[comp.key] = parseAsArray
  //           ? data[comp.key]?.split(',').filter((element) => element) ?? []
  //           : data[comp.key];
  //         break;
  //       case 'button':
  //       case 'content':
  //         break;
  //       case 'datetime':
  //         outputData[comp.key] = parseAsArray
  //           ? data[comp.key]?.split(',').filter((element) => element) ?? []
  //           : data[comp.key];
  //         break;
  //       case 'select':
  //         outputData[comp.key] = parseAsArray
  //           ? data[comp.key]?.split(',').filter((element) => element) ?? []
  //           : data[comp.key];
  //         break;
  //       case 'datamap':
  //       case 'editgrid':
  //       case 'datagrid':
  //         //TODO: GRIDS INSIDE GRIDS ARE NOT SUPPORTED
  //         outputData[comp.key] = [];
  //         let innerData: any = Object.keys(data)
  //           .filter((key) => {
  //             return key.startsWith(comp.key);
  //           })
  //           .reduce((obj, key) => {
  //             let objectKey = key.split('.');
  //             objectKey.shift();
  //             obj[objectKey.join('.')] = data[key];
  //             return obj;
  //           }, {});
  //         const usefulInnerComponents = comp.components.filter(
  //           (innerComp) => innerComp.type != 'button'
  //         );
  //         innerData = this.parseDataFromComponents(
  //           usefulInnerComponents,
  //           innerData,
  //           true
  //         );
  //         let maxLength = -1;
  //         Object.keys(innerData).forEach((key) => {
  //           if (innerData[key].length > maxLength)
  //             maxLength = innerData[key].length;
  //         });
  //         for (let index = 0; index < maxLength; index++) {
  //           let arrayObject: any = {};
  //           Object.keys(innerData).forEach((key) => {
  //             arrayObject[key] = innerData[key][index];
  //           });
  //           outputData[comp.key].push(arrayObject);
  //         }
  //         break;
  //     }
  //   });
  //   return outputData;
  // }

  // async getFormColumns(
  //   components: FormAppComponent[],
  //   deepSearch: boolean = true
  // ): Promise<IFormColumn[]> {
  //   let headers = [];
  //   //TODO: TRY TO ONLY FETCH DROPDOWNS OPTIONS WHEN CREATING THE EXCEL FILES
  //   //FOR DATA VALIDATION ON COMPONENTS OF TYPE SELECT
  //   // const usefulComponents = components.filter((comp) => comp.type != 'button');
  //   for (let index = 0; index < components.length; index++) {
  //     const comp = components[index];
  //     switch (comp.type) {
  //       default:
  //         headers.push({
  //           label: comp.label,
  //           key: comp.key,
  //           type: comp.type,
  //         });
  //         break;
  //       //layout non-containers components should be ignored
  //       case 'button':
  //       case 'content':
  //         break;
  //       case 'datetime':
  //         headers.push({
  //           label: comp.label,
  //           key: comp.key,
  //           config: {
  //             numFmt: comp.format,
  //           },
  //           type: comp.type,
  //         });
  //         break;
  //       case 'select':
  //         //the formulae array is later parsed see "downloadFormAsExcel" to the
  //         //required value when creating an excel with validation
  //         //the next line is the way to directly parse an array of values
  //         //to an excel validation (for excel js), it is commented for reference
  //         //['\"'+comp.data.values.map(val => val.value).join(',')+'\"'];
  //         //this method only works for a limit of characters thats why another
  //         //aproach was taken, since selects may have a long number of options.
  //         let formulae;
  //         if (comp?.data?.values) {
  //           formulae = comp?.data?.values
  //             ? comp.data.values.map((val) => val.value)
  //             : [];
  //         }
  //         if (comp?.data?.json) {
  //           formulae = comp?.data?.json
  //             ? comp.data.json.map((val) => val?.value ?? val)
  //             : [];
  //         }
  //         if (comp?.data?.url) {
  //           formulae = (await this.getFromUrl(comp.data.url)).map(
  //             (res) => res[comp.valueProperty]
  //           );
  //         }
  //         headers.push({
  //           label: comp.label,
  //           key: comp.key,
  //           config: {
  //             dataValidation: {
  //               type: 'list',
  //               allowBlank: true,
  //               formulae: formulae,
  //               showErrorMessage: true,
  //             },
  //           },
  //           type: comp.type,
  //         });
  //         break;
  //       case 'datamap':
  //       case 'editgrid':
  //       case 'datagrid':
  //         // Flag added to filter cases where only simple components are required
  //         if (!deepSearch) {
  //           continue;
  //         }
  //         let innerHeaders = await this.getFormColumns(comp.components);
  //         innerHeaders = innerHeaders.map((h) => {
  //           return {
  //             ...h,
  //             key: `${comp.key}.${h.key}`,
  //             label: `${comp.label}, ${h.label}`,
  //           };
  //         });
  //         headers = headers.concat(innerHeaders);
  //         break;
  //     }
  //   }
  //   return headers;
  // }

  // //Returns null if the headers doesnt match
  // //Returns an array of items or an array of excel raw data (with keys defined by components)
  // //this depends on parseRows value, by default all subsets are parsed to items
  // //it may return an array of arrays of items if subsets != []
  // //the value of subset must be the length of each subset of components in the array
  // //components, these values allows to split parsed/raw data based on components
  // //NOTE: if any of the components of a subset is not an input component these fields
  // //wont exist in the output, also, container/layout components may have inner childs
  // //that generate even more fields at the output, meaning components.length != finalSubsetData.length
  // //subsets is ignored if the sum of all subsets length is greather than the components length
  // async fromExcelToFormData(
  //   file: File,
  //   components: FormAppComponent[],
  //   parseRows: boolean = true,
  //   subsets: number[] = []
  // ) {
  //   const dataBuffer = await file.arrayBuffer();
  //   if (sum(subsets) > components.length) {
  //     subsets = [components.length];
  //   } else {
  //     subsets.push(components.length - sum(subsets));
  //   }
  //   let currrentLength = 0;
  //   const subsetColumns: IFormColumn[][] = [];
  //   for (let index = 0; index < subsets.length; index++) {
  //     const componentsSubset = subsets[index];
  //     const partialComponents = components.slice(
  //       currrentLength,
  //       currrentLength + componentsSubset
  //     );
  //     currrentLength = currrentLength + componentsSubset;
  //     subsetColumns.push(await this.getFormColumns(partialComponents));
  //   }
  //   let columns: IFormColumn[] = [];
  //   subsetColumns.forEach((colset) => {
  //     columns = columns.concat(colset);
  //   });

  //   let workbook = new Workbook();
  //   await workbook.xlsx.load(dataBuffer);
  //   let worksheet = workbook.getWorksheet(1);
  //   let worksheetHeader: any[] = [];
  //   //get the headers of the worksheet
  //   worksheet.getRow(1).eachCell((cell) => {
  //     worksheetHeader.push(cell.value.toString());
  //   });

  //   //if the amount of data columns is not equal to the amount of headers (columns of the worksheet)
  //   //then we return a null as error
  //   if (
  //     !_.isEqual(
  //       columns.map((col) => col.label),
  //       worksheetHeader
  //     )
  //   ) {
  //     return null;
  //   }

  //   //We get the data for each subset of columns and then remove these columns from
  //   //the worksheet, this is done till no subset of columns left
  //   let subsetsData: any[] = [];
  //   subsetColumns.forEach((subColumn, index) => {
  //     let rowsData: any[] = [];
  //     worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
  //       //IMPLEMENTING ARRAY.SOME SINCE IT DOESNT WORK PROPERLY TO FILTER EMPTY CELLS FROM ROWS
  //       //includeEmpty: false filters the row if it is completely empty (but not all the times since an empty string or space may count as not empty)
  //       //Since in most cases an intermediate empty row should be ignored (at least in a subset of answer columns)
  //       //And replaced with an empty value
  //       let flag = false;
  //       //This condition allows empty values to all secondary subsets
  //       if (index === 0) {
  //         row.eachCell((cell) => {
  //           if (cell.value) {
  //             flag = true;
  //             return;
  //           }
  //         });
  //       } else {
  //         flag = rowNumber <= subsetsData[0].length + 1;
  //       }
  //       if (!flag) {
  //         return;
  //       }
  //       //ROW 1 IS THE HEADER
  //       if (rowNumber > 1) {
  //         let rowData = {};
  //         //EXCEL ARRAYS START WITH INDEX 1, INDEX 0 HAS A NULL
  //         for (let cellNumber = 1; cellNumber <= row.cellCount; cellNumber++) {
  //           const cell = row.getCell(cellNumber);
  //           if (cellNumber == subColumn.length + 1) {
  //             break;
  //           }
  //           rowData[subColumn[cellNumber - 1].key] = cell?.text ?? '';
  //         }
  //         rowsData.push(rowData);
  //       }
  //     });
  //     //SPLICE (FROM 1, TO COUNT), 1 = first column
  //     worksheet.spliceColumns(1, subColumn.length);
  //     subsetsData.push(rowsData);
  //   });
  //   //if parse rows is true we parse all results with the respective subset of components
  //   //into objects with item inside (as it is the default name given to the data generated from forms)
  //   if (parseRows) {
  //     const parsedData = subsetsData.map((subsetData, subsetIndex) => {
  //       const partialComponents = components.splice(0, subsets[subsetIndex]);
  //       return subsetData.map((row) => {
  //         return { item: this.parseDataFromComponents(partialComponents, row) };
  //       });
  //     });
  //     return parsedData.length == 1 ? parsedData[0] : parsedData;
  //   } else {
  //     return subsetsData.length == 1 ? subsetsData[0] : subsetsData;
  //   }
  // }

  // private async getFromUrl(url: string): Promise<any[]> {
  //   return await (this.http.get(url).toPromise() as Promise<any[]>);
  // }

  // async show(dbName: string, idForm: string) {
  //   let url = `${environment.forms}view/${idForm}/${dbName}`;
  //   const ref = this.dialogService.open(FrameviewComponent, {
  //     data: {
  //       url: url,
  //     },
  //     header: 'Formulario (Vista previa)',
  //     contentStyle: { overflow: 'hidden' },
  //     height: '90vh',
  //     width: '90vw',
  //   });
  // }
}
