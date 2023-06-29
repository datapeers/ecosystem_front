import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { SiteManagementService } from '../site-management.service';
import { Site } from '../model/site.model';
import { HttpEventType } from '@angular/common/http';
import { StorageService } from '@shared/storage/storage.service';
import { ToastService } from '@shared/services/toast.service';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { Map, tileLayer, marker, Marker } from 'leaflet';

@Component({
  selector: 'app-site-services-management',
  templateUrl: './site-services-management.component.html',
  styleUrls: ['./site-services-management.component.scss'],
})
export class SiteServicesManagementComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  siteID: string;
  site: Site | any = Site.newSite();
  loading = true;
  faReply = faReply;
  showMapSelector = false;
  mapSite: Map;
  mapService: Map;
  ubicationSite;
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
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  ngAfterViewInit(): void {
    // this.initializeMainMap();
  }

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

  saveChanges() {}

  initializeMainMap() {
    if (!this.mapSite) {
      this.mapSite = new Map('mapSite').setView(
        [this.site.coords.lat, this.site.coords.lng],
        15
      );
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 10,
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
}
