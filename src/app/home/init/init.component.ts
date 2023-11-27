import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { AppState } from '@appStore/app.reducer';
import { User } from '@auth/models/user';
import { ConfigurationService } from '@home/configuration/configuration.service';
import { ConfigurationApp } from '@home/configuration/model/configurationApp';
import { Store } from '@ngrx/store';
import { first, firstValueFrom, Subject, Subscription, takeUntil } from 'rxjs';
import { Map, tileLayer, Marker, Icon, geoJSON, control } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Startup } from '@shared/models/entities/startup';
import { ContentsService } from '@home/contents/contents.service';
import { ToastService } from '@shared/services/toast.service';
import { PhasesService } from '@home/phases/phases.service';
import { Stage } from '@home/phases/model/stage.model';
import { getPhaseAndNumb } from '@shared/utils/phases.utils';
import { Phase } from '@home/phases/model/phase.model';
import { lastContent } from '@shared/models/lastContent';
import { Router } from '@angular/router';
import { AnnouncementsService } from '@home/announcements/announcements.service';
import { validRoles } from '@auth/models/valid-roles.enum';
import { ValidRoles } from '../../authentication/models/valid-roles.enum';
import { ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.scss'],
})
export class InitComponent implements OnInit, OnDestroy, AfterViewInit {
  user: User;
  config: ConfigurationApp;
  mainMap: Map;
  latLong = [5.0710225, -75.4927164];
  private states;
  responsiveOptions: any[] | undefined;
  profileDoc;
  startup: Startup;
  userLogs$: Subscription;
  logs = [];
  phasesBases = 0;
  phasesUser = 0;
  phaseName = '';
  phaseNumb = '';
  phaseTitle = '';
  stage: Stage;
  currentBatch: Phase | any;
  lastContent: lastContent;
  onDestroy$: Subject<void> = new Subject();
  phases$: Subscription;
  activesPhases = 0;
  activesAnnouncements = 0;
  lastPhases = [];
  completedT = 75;
  completedTText = '75%';
  widthGraphs = '27rem';
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeMap();
    this.widthGraphs = this.calcularWidthGraph(window.innerWidth);
  }

  // -----------
  basicData: any;
  basicOptions: any;
  data;
  options;
  public get roles(): typeof ValidRoles {
    return ValidRoles;
  }
  @ViewChild('chart') chart: UIChart;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toast: ToastService,
    private store: Store<AppState>,
    private phasesService: PhasesService,
    private contentService: ContentsService,
    private serviceConfig: ConfigurationService,
    private announcementsService: AnnouncementsService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.userLogs$?.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit(): void {
    if (!navigator.geolocation) {
      console.log('locations is not supported');
    }
  }

  async loadComponent() {
    this.config = await this.serviceConfig.getConfig();
    this.loadGraph();
    switch (this.user.rolType) {
      case ValidRoles.user:
        this.setInitUser();
        break;
      case ValidRoles.expert:
        this.setInitExpert();
        break;
      default:
        this.setInitAdmin();
        break;
    }
  }

  async setInitUser() {
    setTimeout(() => {
      this.initializeMainMap();
    }, 500);
    this.profileDoc = await firstValueFrom(
      this.store
        .select((store) => store.auth.profileDoc)
        .pipe(first((i) => i !== null))
    );
    this.lastContentSub();
    this.startup = this.profileDoc.startups[0];
    const userPhases = await this.phasesService.getPhasesList(
      this.profileDoc['startups'][0].phases.map((i) => i._id),
      true
    );
    const basesPhase = userPhases.filter((i) => i.basePhase);
    this.phasesBases = basesPhase.length;
    this.phasesUser = userPhases.filter((i) => !i.basePhase).length;
    this.currentBatch = await firstValueFrom(
      this.store
        .select((store) => store.home.currentBatch)
        .pipe(first((i) => i !== null))
    );
    [this.phaseName, this.phaseNumb] = getPhaseAndNumb(this.currentBatch.name);
    this.phaseTitle = this.currentBatch.name.replace(
      `${this.phaseName} ${this.phaseNumb}: `,
      ''
    );
    this.stage = this.currentBatch.stageDoc;
    this.watchLogStartup();
  }

  async setInitAdmin() {
    this.announcementsService
      .watchAnnouncements()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((announcements) => {
        this.activesAnnouncements = announcements.filter(
          (i) => !i.ended
        ).length;
      });
    this.phasesService
      .watchPhases()
      .then(
        (obsPhases$) =>
          (this.phases$ = obsPhases$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((phasesList: Phase[]) => {
              const phases = phasesList.filter((i) => !i.basePhase);
              this.lastPhases = [];
              this.activesPhases = phasesList.filter((i) => !i.finished).length;
              this.lastPhases = phases.sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime()
              );
            }))
      )
      .catch((err) => {
        this.lastPhases = [];
      });
  }

  async setInitExpert() {}

  resizeMap() {
    if (this.mainMap) {
      this.mainMap.on('viewreset', (value) => {
        this.mainMap.invalidateSize();
      });

      this.mainMap.on('resize', (value) => {
        this.mainMap.invalidateSize();
      });
    }
  }

  loadGraph() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const labels = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    let datasets = [];
    switch (this.user.rolType) {
      case ValidRoles.user:
        datasets = [
          {
            label: '% Avance',
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            data: [0, 0, 0, 3, 5, 0, 0],
          },
          // {
          //   label: 'My Second dataset',
          //   backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          //   borderColor: documentStyle.getPropertyValue('--pink-500'),
          //   data: [28, 48, 40, 19, 86, 27, 90],
          // },
        ];
        break;
      case ValidRoles.expert:
        datasets = [
          {
            label: 'Horas',
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            data: [65, 59, 80, 81, 56, 55, 40],
          },
        ];
        break;
      default:
        datasets = [
          {
            label: 'Usuarios interactuando',
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            data: [4, 2, 1, 5, 3, 0, 0],
          },
        ];
        break;
        break;
    }
    this.data = {
      labels,
      datasets,
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      indexAxis: 'y',
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  async initializeMainMap() {
    if (!this.mainMap) {
      // shapes states
      this.states = await this.getStateShapes();
      const stateLayer = geoJSON(this.states, {
        style: (feature) => ({
          weight: 3,
          opacity: 0.5,
          color: '#008f68',
          fillOpacity: 0.8,
          fillColor: '#6DB65B',
        }),
      });
      // map
      this.mainMap = new Map('mapSite', {
        zoomControl: false,
        minZoom: 2.1,
        maxZoom: 2.1,
      }).setView([20, 0], 0);
      // control.scale({}).addTo(this.mainMap);
      // this.mainMap.setZoom(1.7);
      tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
      ).addTo(this.mainMap);
      this.mainMap.addLayer(stateLayer);
    }
  }

  getStateShapes() {
    return firstValueFrom(
      this.http.get('../../../assets/data/gz_2010_us_outline_5m.json')
    );
  }

  watchLogStartup() {
    this.contentService
      .watchLogsWithFilter({
        'metadata.startup': this.startup._id,
      })
      .then((logs$) => {
        this.userLogs$ = logs$.subscribe((logsList) => {
          this.logs = logsList;
        });
      })
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar logs de startup',
          detail: err,
          life: 12000,
        });
      });
  }

  lastContentSub() {
    this.store
      .select((store) => store.home.lastContent)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(async (i) => {
        this.lastContent = i;
      });
  }

  goContent() {
    this.router.navigate(['/home/contents']);
  }

  goPhases() {
    this.router.navigate(['/home/phases']);
  }

  withOpacity(color: string, opacity: number) {
    const colorRgb = this.hexToRgb(color);
    const style = `rgba(${colorRgb.r},${colorRgb.g},${colorRgb.b}, ${opacity})`;
    return style;
  }

  hexToRgb(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  calcularWidthGraph(resolucion: number): string {
    const factorAtenuacion = 0.8;
    // Resolución base (1980px) y valor base de widthGraph (27rem)
    const resolucionBase = 1980;
    const widthGraphBase = 27;

    // Calcular la relación entre la resolución actual y la resolución base
    const relacionResolucion = resolucion / resolucionBase;

    const nuevoWidthGraph =
      widthGraphBase * Math.pow(relacionResolucion, factorAtenuacion);

    // Redondear el valor a dos decimales y devolverlo como cadena con "rem"
    return `${nuevoWidthGraph.toFixed(2)}rem`;
  }
}
