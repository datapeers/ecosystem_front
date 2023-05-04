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
    const regex = /ecosystem-bt-colombia\/(.+)\?/;
    const match = url.match(regex);
    if (match) {
      return firstValueFrom(
        this.storageService.getFile(match[1]).pipe(
          map((response: any) => {
            return response;
          }),
          map((i) => i.url)
        )
      );
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('');
      }, 100);
    });
  }
}
