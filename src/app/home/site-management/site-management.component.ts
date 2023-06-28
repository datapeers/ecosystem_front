import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { SiteManagementService } from './site-management.service';
import { Site } from './model/site.model';
import { Subscription, tap } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { HttpEventType } from '@angular/common/http';
import { StorageService } from '@shared/storage/storage.service';
import { Map, tileLayer, marker, Marker } from 'leaflet';

@Component({
  selector: 'app-site-management',
  templateUrl: './site-management.component.html',
  styleUrls: ['./site-management.component.scss'],
})
export class SiteManagementComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  sites$: Subscription;
  sites: Site[] = [];
  loading = true;
  showCreatorSite = false;
  newSite = Site.newSite();
  editSite = false;
  saving = false;
  showMap = false;
  mainMap: Map;
  assignMap: Map;
  tabIndex = 0;
  latLong = [5.0710225, -75.4927164];
  markerAdded;

  allMarkersSites = [];
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeMap();
  }

  constructor(
    private readonly service: SiteManagementService,
    private readonly storageService: StorageService,
    private readonly toast: ToastService
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {}

  ngAfterViewInit(): void {
    if (!navigator.geolocation) {
      console.log('locations is not supported');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;
      this.latLong = [coords.latitude, coords.longitude];
    });
    this.initializeMainMap();
  }

  loadComponent() {
    this.service
      .watchSites()
      .then(
        (obsSites$) =>
          (this.sites$ = obsSites$.subscribe((sitesList: Site[]) => {
            this.loading = true;
            this.sites = sitesList;
            for (const iterator of this.allMarkersSites) {
              this.assignMap.removeControl(iterator);
            }
            this.allMarkersSites = [];
            for (const site of this.sites) {
              const markerSite = new Marker([site.coords.lat, site.coords.lng])
                .addTo(this.mainMap)
                .bindPopup(site.name);
              this.allMarkersSites.push(markerSite);
            }
            this.loading = false;
          }))
      )
      .catch((err) => {
        this.toast.alert({
          summary: 'Error al cargar sedes',
          detail: err,
          life: 12000,
        });
        this.sites = [];
        this.loading = false;
      });
  }

  openCreatorSite() {
    this.newSite = Site.newSite();
    this.showCreatorSite = true;
    this.editSite = false;

    if (!this.assignMap) {
      setTimeout(() => {
        this.initializeAssignMap();
      }, 300);
    }
  }

  resetCreatorSite() {
    this.newSite = Site.newSite();
    this.editSite = false;
    this.showCreatorSite = false;
    this.markerAdded = undefined;
  }

  async uploadImage(fileToUpload: File, site: Site | any) {
    this.service
      .updateSiteThumbnail(fileToUpload)
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            // Display upload progress if required
          }
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.Response) {
          const realUrl = this.storageService.getPureUrl(event.url);
          site.thumbnail = realUrl;
        }
      });
  }

  createSite() {
    if (!this.markerAdded) {
      this.toast.alert({
        summary: 'Falta ubicación',
        detail: 'No ha seleccionado una ubicación para la sede',
      });
      return;
    }
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .createSite(this.newSite)
      .then((ans) => {
        this.toast.clear();
        this.resetCreatorSite();
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al crear sede',
          detail: err,
          life: 12000,
        });
        this.resetCreatorSite();
      });
  }

  siteEdit() {}

  resizeMap() {
    if (this.mainMap) {
      this.mainMap.on('viewreset', (value) => {
        this.mainMap.invalidateSize();
      });

      this.mainMap.on('resize', (value) => {
        this.mainMap.invalidateSize();
      });
    }
    if (this.assignMap) {
      this.assignMap.on('viewreset', (value) => {
        this.assignMap.invalidateSize();
      });

      this.assignMap.on('resize', (value) => {
        this.assignMap.invalidateSize();
      });
    }
  }

  changeTab(event) {
    if (this.tabIndex === 1 && this.mainMap) {
      setTimeout(() => {
        this.mainMap.invalidateSize();
      }, 100);
    }
  }

  initializeMainMap() {
    if (!this.mainMap) {
      this.mainMap = new Map('map').setView(this.latLong as any, 15);
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 6,
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.mainMap);
    }
  }

  initializeAssignMap() {
    if (!this.assignMap) {
      this.assignMap = new Map('mapAssign').setView(this.latLong as any, 15);
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 19,
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.assignMap);

      this.assignMap.on('click', (e) => {
        this.newSite.coords = e.latlng;
        if (this.markerAdded) {
          this.assignMap.removeControl(this.markerAdded);
        }
        this.markerAdded = new Marker([
          this.newSite.coords.lat,
          this.newSite.coords.lng,
        ])
          .addTo(this.assignMap)
          .bindPopup('Punto seleccionado');
      });
    }
  }
}
