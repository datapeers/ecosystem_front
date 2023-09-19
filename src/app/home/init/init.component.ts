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
import { first, firstValueFrom } from 'rxjs';
import { Map, tileLayer, Marker, Icon, geoJSON, control } from 'leaflet';
import { HttpClient } from '@angular/common/http';

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
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeMap();
  }
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private serviceConfig: ConfigurationService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
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
}
