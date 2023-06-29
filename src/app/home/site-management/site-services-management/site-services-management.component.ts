import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { SiteManagementService } from '../site-management.service';
import { IServiceSite, ServiceSite, Site } from '../model/site.model';
import { HttpEventType } from '@angular/common/http';
import { StorageService } from '@shared/storage/storage.service';
import { ToastService } from '@shared/services/toast.service';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { Map, tileLayer, Marker, Icon } from 'leaflet';

@Component({
  selector: 'app-site-services-management',
  templateUrl: './site-services-management.component.html',
  styleUrls: ['./site-services-management.component.scss'],
})
export class SiteServicesManagementComponent implements OnInit, OnDestroy {
  siteID: string;
  site: Site | any = Site.newSite();
  loading = true;
  faReply = faReply;
  showMapSelector = false;
  mapSite: Map;
  mapService: Map;
  ubicationSite;

  saving = false;

  newService = new ServiceSite();
  showCreatorService = false;
  markerService;
  editService = false;
  editingIndex;

  listMarkersServices = [];
  iconServiceMap;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeMap();
  }
  constructor(
    private _location: Location,
    private routeOpt: ActivatedRoute,
    private service: SiteManagementService,
    private readonly storageService: StorageService,
    private readonly toast: ToastService
  ) {
    this.siteID = this.routeOpt.snapshot.params['id'];
    this.iconServiceMap = new Icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      iconUrl: '../../../../assets/leaf-orange.png',
    });
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {}

  async loadComponent() {
    this.site = await this.service.getSite(this.siteID);
    this.loading = false;
    this.initializeMainMap();
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

  return() {
    this._location.back();
  }

  resetMapSelector() {
    this.showMapSelector = false;
  }

  saveChanges() {
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateSite(this.site._id, this.site.toSave())
      .then((ans) => {
        this.toast.clear();
        this.toast.success({
          detail: 'Los cambios a la sede han sido guardados',
          summary: 'Sede editada!',
          life: 2000,
        });
      })
      .catch((err) => {
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar sede',
          detail: err,
          life: 12000,
        });
      });
  }

  initializeMainMap() {
    if (!this.mapSite) {
      this.mapSite = new Map('mapSite').setView(
        [this.site.coords.lat, this.site.coords.lng],
        17
      );
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.mapSite);

      this.ubicationSite = new Marker([
        this.site.coords.lat,
        this.site.coords.lng,
      ])
        .addTo(this.mapSite)
        .bindPopup('Ubicación sede');

      this.mapSite.on('click', (e) => {
        this.site.coords = e.latlng;
        if (this.ubicationSite) {
          this.mapSite.removeControl(this.ubicationSite);
        }
        this.ubicationSite = new Marker([
          this.site.coords.lat,
          this.site.coords.lng,
        ])
          .addTo(this.mapSite)
          .bindPopup('Ubicación sede');
      });
      this.setMarkerServices();
    }
  }

  initializeServiceMap() {
    if (!this.mapService) {
      this.mapService = new Map('mapService').setView(
        [this.site.coords.lat, this.site.coords.lng],
        19
      );
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.mapService);

      this.mapService.on('click', (e) => {
        this.newService.coords = e.latlng;
        if (this.markerService) {
          this.mapService.removeControl(this.markerService);
        }
        this.markerService = new Marker(
          [this.newService.coords.lat, this.newService.coords.lng],
          {
            icon: this.iconServiceMap,
          }
        )
          .addTo(this.mapService)
          .bindPopup('Ubicación seleccionado');
      });
    }
  }

  resizeMap() {
    if (this.mapSite) {
      this.mapSite.on('viewreset', (value) => {
        this.mapSite.invalidateSize();
      });

      this.mapSite.on('resize', (value) => {
        this.mapSite.invalidateSize();
      });
    }
    if (this.mapService) {
      this.mapService.on('viewreset', (value) => {
        this.mapService.invalidateSize();
      });

      this.mapService.on('resize', (value) => {
        this.mapService.invalidateSize();
      });
    }
  }

  openCreatorService(service?: IServiceSite, index?: number) {
    if (service) this.editService = true;
    this.editingIndex = index;
    this.newService = new ServiceSite(service);
    this.showCreatorService = true;
    setTimeout(() => {
      if (!this.mapService) {
        this.initializeServiceMap();
      }
      if (this.markerService) {
        this.mapService.removeControl(this.markerService);
      }
      if (service) {
        this.markerService = new Marker(
          [this.newService.coords.lat, this.newService.coords.lng],
          {
            icon: this.iconServiceMap,
          }
        )
          .addTo(this.mapService)
          .bindPopup('Ubicación seleccionado');
      }
    }, 100);
  }

  saveEditService() {
    this.site.services[this.editingIndex] = this.newService;
    this.site.services = [...this.site.services];
    this.resetCreatorService();
  }

  resetCreatorService() {
    this.newService = new ServiceSite();
    this.showCreatorService = false;
    this.saving = false;
    this.editingIndex = undefined;
  }

  createService() {
    this.site.services.push(this.newService);
    this.site.services = [...this.site.services];
    this.listMarkersServices.push(this.markerService);
    this.setMarkerServices();
    this.resetCreatorService();
  }

  deleteService(index) {
    this.site.services.splice(index, 1);
    this.setMarkerServices();
  }

  setMarkerServices() {
    for (const iterator of this.listMarkersServices) {
      this.mapSite.removeControl(iterator);
    }
    this.listMarkersServices = [];
    for (const service of this.site.services) {
      const markerService = new Marker(
        [service.coords.lat, service.coords.lng],
        { icon: this.iconServiceMap }
      )
        .addTo(this.mapSite)
        .bindPopup(service.name);
      this.listMarkersServices.push(markerService);
    }
  }

  changeOnCoords(event) {
    if (this.ubicationSite) {
      this.mapSite.removeControl(this.ubicationSite);
    }
    this.ubicationSite = new Marker([
      this.site.coords.lat,
      this.site.coords.lng,
    ])
      .addTo(this.mapSite)
      .bindPopup('Ubicación sede');
  }

  changeOnCoordsService(event) {
    if (this.markerService) {
      this.mapService.removeControl(this.markerService);
    }
    this.markerService = new Marker(
      [this.newService.coords.lat, this.newService.coords.lng],
      {
        icon: this.iconServiceMap,
      }
    )
      .addTo(this.mapService)
      .bindPopup('Ubicación seleccionado');
  }
}
