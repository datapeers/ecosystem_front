import { Component, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-qr-view',
  templateUrl: './qr-view.component.html',
  styleUrls: ['./qr-view.component.scss'],
})
export class QrViewComponent {
  url: string = '';
  title: string = '';
  codeWidth: number = 256;
  lightColor: string = '#FFFFFFFF';
  darkColor: string = '#000000FF';
  imageSrc: string = '';
  imageWidth: number = 0;
  imageHeight: number = 0;
  copied: Record<string, boolean> = {
    link: false,
    image: false,
  };

  clipboardWriteSupport: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private clipboard: Clipboard
  ) {
    const baseUrl = this.config?.data?.url ?? '';
    this.url = encodeURI(baseUrl);
    this.title = this.config?.data?.title ?? '';
    this.config.header = this.title;
    //Check if clipboard.write is available to enable or disable image copy button
    if (navigator?.clipboard?.write) {
      this.clipboardWriteSupport = true;
    }
  }

  @ViewChild('qrElement') qrElement;

  ngOnInit(): void {}

  handleDownload() {
    const canvasElement: HTMLCanvasElement =
      this.qrElement.qrcElement.nativeElement.getElementsByTagName('canvas')[0];
    const fileName = `Qr code ${Date.now()}`;
    const MIME_TYPE = 'image/png';
    const imgURL = canvasElement.toDataURL(MIME_TYPE);
    const tempLink = document.createElement('a');
    tempLink.download = fileName;
    tempLink.href = imgURL;
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }

  handleImageCopy() {
    if (!navigator?.clipboard || !this.clipboardWriteSupport) {
      return;
    }

    //Delay
    if (this.copied['image']) {
      return;
    }

    this.copied['image'] = true;
    const canvasElement: HTMLCanvasElement =
      this.qrElement.qrcElement.nativeElement.getElementsByTagName('canvas')[0];
    canvasElement.toBlob((blob) => {
      //Note: Doesnt work for firefox
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob as any,
        }),
      ]);
      //Note: Angular seems to ignore changes done in this callback for some reason
      //Updating this.copied.image here only updates the view if the user do something else
    }, 'image/png');
    setTimeout(() => {
      this.copied['image'] = false;
    }, 500);
  }

  handleLinkCopy() {
    //Delay
    if (this.copied['link']) {
      return;
    }
    this.clipboard.copy(this.url);
    this.copied['link'] = true;
    setTimeout(() => {
      this.copied['link'] = false;
    }, 500);
  }
}
