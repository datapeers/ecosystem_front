import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { SiteManagementService } from './site-management.service';
import { Site } from './model/site.model';
import { Subscription, first, firstValueFrom, tap } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';
import { HttpEventType } from '@angular/common/http';
import { StorageService } from '@shared/storage/storage.service';
import { Map, tileLayer, marker, Marker } from 'leaflet';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { User } from '@auth/models/user';
import { Store } from '@ngrx/store';
import { AppState } from '@appStore/app.reducer';
import { Permission } from '@auth/models/permissions.enum';
import { configTinyMce } from '@shared/models/configTinyMce';
import { ShepherdService } from 'angular-shepherd';
import { servicesOnboarding } from '@shared/onboarding/onboarding.config';

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
  saving = false;

  tabIndex = 0;

  mainMap: Map;
  assignMap: Map;
  latLong = [5.0710225, -75.4927164];
  markerAdded;

  allMarkersSites = [];
  selectedSite;
  user: User;
  factoresDiferenciales = [];
  creatingService = false;
  editingService = false;
  configTiny = configTinyMce;
  public get userPermission(): typeof Permission {
    return Permission;
  }

  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   this.resizeMap();
  // }
  cols = [
    { field: 'name', header: 'Nombre' },
    { field: 'email', header: 'Correo' },
    { field: 'contact', header: 'Telefono' },
    { field: 'others', header: 'Otros' },
  ];
  constructor(
    private store: Store<AppState>,
    private readonly router: Router,
    private confirmationService: ConfirmationService,
    private readonly service: SiteManagementService,
    private readonly storageService: StorageService,
    private readonly toast: ToastService
  ) {
    firstValueFrom(
      this.store
        .select((store) => store.auth.user)
        .pipe(first((i) => i !== null))
    ).then((u) => (this.user = u));
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    this.sites$?.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (!navigator.geolocation) {
      console.log('locations is not supported');
    }
    // this.initializeMainMap();
  }

  loadComponent() {
    this.service
      .watchSites()
      .then(
        (obsSites$) =>
          (this.sites$ = obsSites$.subscribe((sitesList: Site[]) => {
            this.loading = true;
            this.sites = sitesList;
            // for (const iterator of this.allMarkersSites) {
            //   this.mainMap.removeControl(iterator);
            // }
            // this.allMarkersSites = [];
            // for (const site of this.sites) {
            //   const markerSite = new Marker([site.coords.lat, site.coords.lng])
            //     .addTo(this.mainMap)
            //     .bindPopup(site.name);
            //   this.allMarkersSites.push(markerSite);
            // }
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

  openCreatorSite(prevSite?: Site, onlyView?: boolean) {
    this.newSite = Site.newSite(prevSite);
    this.showCreatorSite = true;
    this.creatingService = prevSite ? false : true;
    this.editingService = prevSite && !onlyView ? true : false;
    // if (!this.assignMap) {
    //   setTimeout(() => {
    //     this.initializeAssignMap();
    //   }, 100);
    // }
  }

  navigateToEdit(site: Site) {
    this.router.navigate([`/home/site_management/${site._id}`]);
  }

  deleteSite(site: Site) {
    this.confirmationService.confirm({
      key: 'confirmDialog',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      header: '¿Está seguro de que desea continuar?',
      message: '¿Está seguro de que desea eliminar esta sede?',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.toast.info({ detail: '', summary: 'Eliminado...' });
        this.service
          .deleteSite(site._id)
          .then((ans) => {
            this.toast.clear();
            this.toast.success({
              detail: 'El servicio ha sido eliminado exitosamente',
              summary: 'Evento eliminado!',
              life: 1500,
            });
          })
          .catch((err) => {
            this.toast.clear();
            this.toast.alert({
              summary: 'Error al intentar eliminar servicio',
              detail: err,
              life: 12000,
            });
          });
      },
    });
  }

  resetCreatorSite() {
    this.newSite = Site.newSite();
    this.showCreatorSite = false;
    this.markerAdded = undefined;
    this.saving = false;
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
    // if (!this.markerAdded) {
    //   this.toast.alert({
    //     summary: 'Falta ubicación',
    //     detail: 'No ha seleccionado una ubicación para la sede',
    //   });
    //   return;
    // }
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.saving = true;
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
        minZoom: 1,
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.mainMap);
    }
  }

  // initializeAssignMap() {
  //   if (!this.assignMap) {
  //     this.assignMap = new Map('mapAssign').setView(this.latLong as any, 17);
  //     tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       minZoom: 1,
  //       maxZoom: 20,
  //       attribution:
  //         '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //     }).addTo(this.assignMap);

  //     this.assignMap.on('click', (e) => {
  //       this.newSite.coords = e.latlng;
  //       if (this.markerAdded) {
  //         this.assignMap.removeControl(this.markerAdded);
  //       }
  //       this.markerAdded = new Marker([
  //         this.newSite.coords.lat,
  //         this.newSite.coords.lng,
  //       ])
  //         .addTo(this.assignMap)
  //         .bindPopup('Ubicación seleccionado');
  //     });
  //   }
  // }

  // changeOnCoords(event) {
  //   if (this.markerAdded) {
  //     this.assignMap.removeControl(this.markerAdded);
  //   }
  //   this.markerAdded = new Marker([
  //     this.newSite.coords.lat,
  //     this.newSite.coords.lng,
  //   ])
  //     .addTo(this.assignMap)
  //     .bindPopup('Ubicación seleccionado');
  // }

  addContact() {
    this.newSite.contacts.push({
      name: '',
      contact: '',
      email: '',
      others: '',
    });
  }

  saveChanges() {
    this.saving = true;
    this.toast.info({ detail: '', summary: 'Guardando...' });
    this.service
      .updateSite(this.newSite._id, this.newSite)
      .then((ans) => {
        this.toast.clear();
        this.toast.success({
          detail: 'Los cambios al servicio han sido guardados',
          summary: 'Servicio editado!',
          life: 2000,
        });
        this.saving = false;
      })
      .catch((err) => {
        this.saving = false;
        this.toast.clear();
        this.toast.alert({
          summary: 'Error al editar servicio',
          detail: err,
          life: 12000,
        });
      });
  }
}
