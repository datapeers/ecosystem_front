import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoragePaths } from './storage.constants';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly apiUrl: string = `${environment.api}/storage`;
  constructor(private readonly http: HttpClient) {}

  uploadFile(
    filePath: StoragePaths | string,
    file: File,
    publicFile?: boolean
  ): Observable<HttpEvent<HttpEventType>> {
    // Get a presigned URL for uploading the file
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json');
    const key = `${filePath}/${file.name}`;
    const request = this.http.post<{ url: string }>(
      this.apiUrl,
      { name: key, publicFile },
      { headers: headers }
    );
    return request.pipe(
      mergeMap(({ url: presignedUrl }) => {
        // Use the presigned URL to upload the file to S3
        const headers = new HttpHeaders({ 'Content-Type': file.type });
        const req = new HttpRequest('PUT', presignedUrl, file, { headers });
        return this.http.request<HttpEventType>(req);
      })
    );
  }

  deleteFile(
    filePath: string,
    fileName: string,
    publicFile?: boolean
  ): Observable<HttpEvent<HttpEventType>> {
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json');
    const request = this.http.post<{ url: string }>(
      this.apiUrl,
      { name: `${filePath}/${fileName}`, publicFile },
      { headers: headers }
    );
    return request.pipe(
      mergeMap(({ url: presignedUrl }) => {
        const req = new HttpRequest('DELETE', presignedUrl);
        return this.http.request<HttpEventType>(req);
      })
    );
  }

  getFile(key: string): Observable<string> {
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json');
    const request = this.http.get<{ url: string }>(
      `${this.apiUrl}?key=${key}`,
      {
        headers: headers,
      }
    );
    return request.pipe(map((i) => i.url));
  }

  getKey(url: string) {
    const regex = /ecosystem-bt-colombia\/(.+)\?/;
    const match = url.match(regex);
    if (match) {
      return match[1];
    }
    return '';
  }

  getPureUrl(url: string) {
    return url.split('?')[0];
  }
}
