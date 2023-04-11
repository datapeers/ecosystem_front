import { Component, OnDestroy, OnInit } from '@angular/core';
import { PhasesService } from '../phases.service';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { PhasesCreatorComponent } from '../phases-creator/phases-creator.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-phases-config',
  templateUrl: './phases-config.component.html',
  styleUrls: ['./phases-config.component.scss'],
})
export class PhasesConfigComponent implements OnInit, OnDestroy {
  selectedPhase;
  faReply = faReply;
  fases = [
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 1',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://www.zamnesia.com/img/cms/Grow-Guide/CMS563_GG287_what_are_cannabis_seedlings/new_12_12_2022/What-are-cannabis-seedlings.jpg',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 2',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://media.istockphoto.com/id/1085122436/photo/young-plant-growing-in-garden-with-sunlight.jpg?s=612x612&w=0&k=20&c=huN8N8gYoN7bXBrPGOOzbMQGr9KPo8ikvfR1hv2sA-E=',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 3',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://www.almanac.com/sites/default/files/styles/or/public/image_nodes/pepper-seedling.jpg',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 4',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://www.flowerpower.com.au/wordpress/wp-content/uploads/2018/10/Wide-crop-Bora-bora-hanging-planters-with-string-of-beans-and-rhipsalis-DSC_8805.jpg',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 5',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://www.cnet.com/a/img/resize/0669a00890e8a427bbd28eef874b9385af26c51b/hub/2022/11/10/2cfdf6db-3f9a-4fad-be3e-319af6ac761a/gettyimages-1202757463.jpg?auto=webp&fit=crop&height=675&width=1200',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 6',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://image.shutterstock.com/image-photo/tropical-foliage-dark-green-nature-260nw-2121147722.jpg',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 7',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://2.bp.blogspot.com/-9UvtPAhnuEk/U6vIsHoKE9I/AAAAAAAAYyc/VwokZ-ay0lk/s1600/Tetrapanax+1+small.jpg',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 8',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://img.freepik.com/premium-photo/green-lotus-leaves-garden-leaf-veins-big-green-lotus-plant-leaves-nelumbonaceae-is-family-aquatic-flowering-plants-large-water-lily-park-nelumbo-is-genus-aquatic-plants_353092-316.jpg',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 9',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://r3c5q8u7.rocketcdn.me/wp-content/uploads/2020/01/nursery-wide-2.jpg',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
    {
      __typename: 'espacios',
      _id: '6331a497087182f20b92fb4d',
      nombre: 'Fase 10',
      tags: [
        {
          __typename: 'espacios_tags',
          _id: '62044c39f01af5d4f055324b',
          nombre: 'Capacitación',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T21:30:57.826Z',
        },
        {
          __typename: 'espacios_tags',
          _id: '62044c79f01af5d4f055324d',
          nombre: 'Emprendimiento',
          estaEliminado: false,
          rating: 0,
          fechaCreado: '2022-02-09T21:30:57.826Z',
          fechaActualizado: '2022-02-09T23:26:46.951Z',
        },
      ],
      miniatura:
        'https://www.allaboutgardening.com/wp-content/uploads/2022/03/Beautiful-Flowering-Tree-1200x667.jpeg',
      inicio: '2022-09-26T04:00:00.000Z',
      fin: '2025-02-19T04:00:00.000Z',
      fechaActualizado: '2023-03-22T15:54:16.656Z',
      activo: true,
      publico: true,
      destacado: false,
      descripcion: 'Retos y desafíos que impiden el crecimiento de tu empresa',
      tipoEspacio: {
        __typename: 'tipos_espacios',
        _id: '612fd76aa8a123a2f5a6bbdc',
        name: 'Programa Síncrono',
        content: {
          tipoParticipantes: true,
          libreAcceso: true,
          inicio: true,
          fin: true,
          sinRegistro: false,
        },
        type: 'sync_space',
      },
      libreAcceso: false,
      tipoParticipantes: 'empresarios',
      sinPublicar: false,
      participantes_prospecto: null,
      tagsNames: 'Capacitación, Emprendimiento',
    },
  ];
  dialogRef;
  onCloseDialogSub$: Subscription;
  constructor(
    private service: PhasesService,
    private _location: Location,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy() {
    this.onCloseDialogSub$?.unsubscribe();
  }

  return() {
    this._location.back();
  }

  openCreator() {
    this.dialogRef = this.dialogService.open(PhasesCreatorComponent, {
      header: 'Creador de fase',
      width: '70vw',
      height: '70vh',
      data: {
        parents: [],
      },
    });

    this.onCloseDialogSub$ = this.dialogRef.onClose.subscribe(async (data) => {
      this.onCloseDialogSub$.unsubscribe();
      this.dialogRef = null;
    });
  }
}
