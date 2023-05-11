import { uniqueId } from 'lodash';
import { StorageService } from '@shared/services/storage.service';
import { StoragePaths } from '@shared/services/storage.constants';
import { Injector } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHandler,
  HttpXhrBackend,
} from '@angular/common/http';

export const configTinyMce = {
  height: 300,
  menubar: true,
  language: 'es',
  image_advtab: true,
  default_link_target: '_blank',
  //  skin_url: '../../../assets/tinymce/skins/lightgray',
  images_upload_handler: async function (blobInfo, success, failure) {
    const httpClientInjector = Injector.create({
      providers: [
        { provide: HttpClient, deps: [HttpHandler] },
        {
          provide: HttpHandler,
          useValue: new HttpXhrBackend({ build: () => new XMLHttpRequest() }),
        },
      ],
    });

    const injector = Injector.create({
      providers: [
        {
          provide: StorageService,
          useClass: StorageService,
        },
      ],
      parent: httpClientInjector,
    });

    const wantedServiceC = injector.get(StorageService);
    const renamedFile = new File([blobInfo.blob()], uniqueId('contents'), {
      type: blobInfo.type,
      lastModified: blobInfo.lastModified,
    });
    wantedServiceC
      .uploadFile(StoragePaths.contentImages, renamedFile, true)
      .subscribe((event) => {
        if (event.type === HttpEventType.Response) {
          success(wantedServiceC.getPureUrl(event.url));
        }
      });
  },
  imagetools_toolbar:
    'rotateleft rotateright | flipv fliph | editimage imageoptions',
  menu: {
    file: { title: 'File', items: 'preview | print ' },
    edit: {
      title: 'Edit',
      items: 'undo redo | cut copy paste | selectall | searchreplace',
    },
    view: {
      title: 'View',
      items:
        'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen',
    },
    insert: {
      title: 'Insert',
      items:
        'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
    },
    format: {
      title: 'Format',
      items:
        'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat',
    },
    tools: {
      title: 'Tools',
      items: 'spellchecker spellcheckerlanguage | code wordcount',
    },
    table: {
      title: 'Table',
      items: 'inserttable | cell row column | tableprops deletetable',
    },
    help: { title: 'Help', items: 'help' },
  },
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'visualchars',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor | \
       alignleft aligncenter alignright alignjustify | \
       bullist numlist outdent indent | removeformat | help | table | image | link | media',
};
