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
import { first, firstValueFrom, Subscription } from 'rxjs';
import { Map, tileLayer, Marker, Icon, geoJSON, control } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Startup } from '@shared/models/entities/startup';
import { ContentsService } from '@home/contents/contents.service';
import { ToastService } from '@shared/services/toast.service';
import { PhasesService } from '@home/phases/phases.service';
import { Stage } from '@home/phases/model/stage.model';
import { getPhaseAndNumb } from '@shared/utils/others';
import { Phase } from '@home/phases/model/phase.model';

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
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeMap();
  }
  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private store: Store<AppState>,
    private phasesService: PhasesService,
    private contentService: ContentsService,
    private serviceConfig: ConfigurationService
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
  }

  ngAfterViewInit(): void {
    if (!navigator.geolocation) {
      console.log('locations is not supported');
    }
  }

  async loadComponent() {
    this.config = await this.serviceConfig.getConfig();
    setTimeout(() => {
      this.initializeMainMap();
    }, 500);
    if (this.user.isUser) {
      this.profileDoc = await firstValueFrom(
        this.store
          .select((store) => store.auth.profileDoc)
          .pipe(first((i) => i !== null))
      );
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
      [this.phaseName, this.phaseNumb] = getPhaseAndNumb(
        this.currentBatch.name
      );
      this.phaseTitle = this.currentBatch.name.replace(
        `${this.phaseName} ${this.phaseNumb}: `,
        ''
      );
      this.stage = this.currentBatch.stageDoc;
      this.watchLogStartup();
    }
  }

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
          console.log(this.logs.length);
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
}
