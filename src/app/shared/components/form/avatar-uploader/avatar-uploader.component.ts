import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-avatar-uploader',
  templateUrl: './avatar-uploader.component.html',
  styleUrls: ['./avatar-uploader.component.scss']
})
export class AvatarUploaderComponent {
  @Input() imageUrl: string = "";
  @Output() onUpload: EventEmitter<File> = new EventEmitter();
  @Output() onRemove: EventEmitter<void> = new EventEmitter();

  selectFile(element: HTMLInputElement) {
    const files = element.files;
    if (files && files.item(0)) {
      this.onUpload.next(files.item(0));
    }
  }

  removeImage() {
    this.onRemove.next();
  }
}
