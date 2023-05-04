import { HttpClient, HttpEventType } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { StorageService } from '@shared/services/storage.service';
import { Observable, first, firstValueFrom, map } from 'rxjs';

@Pipe({
  name: 'getImage',
})
export class GetImagePipe implements PipeTransform {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  transform(url: string): Promise<any> {
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
