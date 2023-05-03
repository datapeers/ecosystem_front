import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoragePaths } from './storage.constants';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly apiUrl: string = `${environment.api}/storage`;
  constructor(private readonly http: HttpClient) {}

  uploadFile(
    filePath: StoragePaths,
    file: File
  ): Observable<HttpEvent<HttpEventType>> {
    // Get a presigned URL for uploading the file
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json');
    const request = this.http.post<{ url: string }>(
      this.apiUrl,
      { name: `${filePath}/${file.name}` },
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
    fileName: string
  ): Observable<HttpEvent<HttpEventType>> {
    // Get a presigned URL for uploading the file
    const headers = new HttpHeaders();
    headers.set('Content-type', 'application/json');
    const request = this.http.post<{ url: string }>(
      this.apiUrl,
      { name: `${filePath}/${fileName}` },
      { headers: headers }
    );
    return request.pipe(
      mergeMap(({ url: presignedUrl }) => {
        // Use the presigned URL to upload the file to S3
        const req = new HttpRequest('DELETE', presignedUrl);
        return this.http.request<HttpEventType>(req);
      })
    );
  }
}
