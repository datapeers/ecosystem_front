import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  datedDataStorage,
  LabelValueConfig,
  ListedObject,
} from './models/datefilter.interfaces';

@Component({
  selector: 'app-datefilter',
  templateUrl: './datefilter.component.html',
  styleUrls: ['./datefilter.component.scss'],
})
export class DatefilterComponent {
  //Childs, Inputs and Outputs
  @Input() filterTypeOptions: LabelValueConfig[] = [
    { label: 'Contiene', value: 'contains' },
    //{ label: 'Comienza con', value: 'startsWith' },
    //{ label: 'Igual', value: 'equals' }
  ];
  @Input() viewOptions: LabelValueConfig[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Proximos', value: 'future' },
    { label: 'Pasados', value: 'past' },
    { label: 'Activos', value: 'current' },
    { label: 'En curso', value: 'daily' },
    { label: 'Por rango', value: 'between' },
  ];
  @Input() rangeSelector: string = 'selectButton';
  @Input() alwaysBetween: boolean = true;
  @Input() emitAll: boolean = true;
  @Input() order: string = 'all';
  @Input() dateTooltip: string =
    'Sólo se pueden seleccionar fechas entre las que existen resultados';
  @Input() inputTooltip: string = '';

  _listOfObjects: any;
  get listOfObjects() {
    return this._listOfObjects;
  }
  @Input() set listOfObjects(value: any) {
    this._listOfObjects = value;
    if (value && value.length > 0) {
      this.configure();
      this.calculateInitValues();
    }
  }

  @Input() customDate: Date;
  @Output() OnInput = new EventEmitter<string>();
  @Output() OnChange = new EventEmitter<any>();

  //ngModels (Value holders)
  currentFilterType = 'contains';
  currentFilterFieldName = 'Titulo';
  currentFilterFieldValue = '';
  rangeDates: Date[] = [new Date(), new Date()];
  minDate: Date;
  maxDate: Date;
  dataStorage: datedDataStorage = { all: [] };
  currentDate = new Date();
  eventDates: Date[] = [];

  //Subscriptions
  debouncer: Subject<string> = new Subject();

  constructor() {}

  ngOnInit(): void {
    this.configure();
    this.debouncer.pipe(debounceTime(150)).subscribe((valor) => {
      this.OnInput.emit(valor);
    });
  }

  ngOnDestroy(): void {
    if (this.debouncer) {
      this.debouncer.unsubscribe();
    }
  }

  configure() {
    if (this.alwaysBetween) {
      this.viewOptions = this.viewOptions.filter((vo) => vo.value != 'between');
    }
  }

  calculateInitValues() {
    this.listOfObjects.forEach((e) => {
      e.state = {};
    });
    this.minDate = new Date();
    this.maxDate = new Date();
    this.sortByDates(this.listOfObjects);
    this.minDate.setTime(
      this.listOfObjects[this.listOfObjects.length - 1].date.getTime()
    );
    this.maxDate.setTime(this.listOfObjects[0].date.getTime());
    this.rangeDates[0] = this.minDate;
    this.rangeDates[1] = this.maxDate;
    this.filterByDate(this.minDate, this.maxDate, false);
    this.emitOutput();
  }

  emitOutput() {
    if (!this.emitAll) {
      this.OnChange.emit(this.dataStorage[this.order]);
      return;
    }
    let Output = this.viewOptions.map((option) => {
      return {
        label: option.label,
        array: this.dataStorage[option.value],
      };
    });
    this.OnChange.emit(Output);
  }

  sortByDates(arr: ListedObject[]) {
    arr.sort((a1, a2) => (a1.date.getTime() <= a2.date.getTime() ? 1 : -1));
  }

  clearRange() {
    if (this.minDate && this.maxDate) {
      this.rangeDates = [];
      this.rangeDates.push(this.minDate);
      this.rangeDates.push(this.maxDate);
      this.filterByDate(this.rangeDates[0], this.rangeDates[1]);
      this.emitOutput();
    } else {
      this.rangeDates = [new Date(), new Date()];
    }
  }

  applyNewRange() {
    if (!this.rangeDates[0]) {
      return;
    }
    if (this.rangeDates[0] && !this.rangeDates[1]) {
      this.filterByDate(this.rangeDates[0], this.rangeDates[0]);
      return;
    }
    this.filterByDate(this.rangeDates[0], this.rangeDates[1]);
    this.emitOutput();
  }

  switchStorage(event) {
    this.emitOutput();
  }

  filterByDate(minDate: Date, maxDate: Date, onlyBetween: boolean = true) {
    let options: string[] = [];
    let arr: ListedObject[] = this.listOfObjects;
    let vops = this.viewOptions.map((vo) => vo.value);
    let pastfutureFlag = false;
    if (this.alwaysBetween) {
      options = vops.filter((vo) => vo != 'between');
      options.splice(0, 0, 'between');
    } else {
      onlyBetween ? (options = ['between']) : (options = vops);
    }
    let cdt: number = new Date().getTime();
    options.forEach((viewOption) => {
      switch (viewOption) {
        default:
          break;
        case 'future':
        case 'past':
          if (pastfutureFlag) {
            break;
          }
          pastfutureFlag = true;
          let past: ListedObject[] = [];
          let future: ListedObject[] = [];
          arr.forEach((e) => (e.state.isOld = false));
          arr.forEach((e) => (e.state.willCome = false));
          arr.forEach((e) =>
            e.date.getTime() < cdt ? past.push(e) : future.push(e)
          );
          past.forEach((oldObject) => {
            oldObject.state.isOld = true;
          });
          future.forEach((futureObject) => {
            futureObject.state.willCome = true;
          });
          this.dataStorage['past'] = past;
          this.dataStorage['future'] = future;
          break;
        case 'current':
          let current: ListedObject[] = [];
          if (arr.length > 0) {
            if (!arr[0].hasOwnProperty('duration')) {
              this.dataStorage['current'] = arr;
              break;
            }
          }
          arr.forEach((e) => (e.state.isCurrent = false));
          arr.forEach((e) => {
            if (e.duration) {
              const et = e.date.getTime();
              let maxdate = new Date(e.date.getTime());
              let currentMinutes = Number(maxdate.getMinutes());
              const addedMinutes = currentMinutes + Number(e.duration);
              maxdate.setMinutes(addedMinutes);
              const maxdatetime = maxdate.getTime();
              cdt > et && cdt < maxdatetime ? current.push(e) : null;
            }
          });
          current.forEach((currentObject) => {
            currentObject.state.isCurrent = true;
          });
          this.dataStorage['current'] = current;
          break;
        case 'between':
          let between: ListedObject[] = [];
          arr.forEach((e) => (e.state.inRange = false));
          let minTime = minDate.getTime();
          let maxTime = maxDate.getTime();
          arr.forEach((e) => {
            let eventTime = e.date.getTime();
            eventTime >= minTime && eventTime <= maxTime
              ? between.push(e)
              : null;
          });
          between.forEach((inRangeObject) => {
            inRangeObject.state.inRange = true;
          });
          this.dataStorage['between'] = between;
          if (this.alwaysBetween) {
            arr = between;
          }
          break;
        case 'daily':
          var daily: ListedObject[] = [];
          const Today = new Date();
          const ty = Today.getFullYear();
          const tm = Today.getMonth();
          const td = Today.getDate();
          arr.forEach((e) => (e.state.daily = false));
          arr.forEach((e) => {
            const d = e.date.getDate();
            const m = e.date.getMonth();
            const y = e.date.getFullYear();
            !(y == ty)
              ? null
              : !(m == tm)
              ? null
              : !(d == td)
              ? null
              : daily.push(e);
          });
          daily.forEach((inRangeObject) => {
            inRangeObject.state.daily = true;
          });
          this.dataStorage['daily'] = daily;
          break;
      }
    });
    this.dataStorage['all'] = arr;
  }

  filter() {
    this.debouncer.next(this.currentFilterFieldValue);
  }
}
