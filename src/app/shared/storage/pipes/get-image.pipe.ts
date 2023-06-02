import { Pipe, PipeTransform } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StorageService } from '../storage.service';

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
      const getUrl = firstValueFrom(this.storageService.getFile(key));
      return getUrl;
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('');
      }, 100);
    });
  }
}
