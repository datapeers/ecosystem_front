import { HttpClient, HttpEventType } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '@shared/services/storage.service';
import { firstValueFrom } from 'rxjs';

@Pipe({
  name: 'getImage',
})
export class GetImagePipe implements PipeTransform {
  constructor(
    private storageService: StorageService
  ) {}

  async transform(url: string): Promise<string> {
    if(url.includes("http://localhost:4566")) {
      return url;
    }
    const key = this.storageService.getKey(url);
    if (key !== '') {
      return firstValueFrom(this.storageService.getFile(key));
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('');
      }, 100);
    });
  }
}
