import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.apiUrl;

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoUploadService {
  constructor(private http: HttpClient) {}

  uploadPhotos(files: File[], reportId?: number): Observable<HttpEvent<any>> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append('photos', file);
    });

    if (reportId) {
      formData.append('reportId', reportId.toString());
    }

    const headers = new HttpHeaders();

    return this.http.post(`${BASIC_URL}customer-reports/upload`, formData, {
      reportProgress: true,
      observe: 'events',
      headers
    });
  }

  uploadPhoto(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<{ photoUrl: string }>(`${BASIC_URL}customer-reports/upload-single`, formData).pipe(
      map(response => response.photoUrl)
    );
  }

  deletePhoto(photoUrl: string): Observable<void> {
    return this.http.delete<void>(`${BASIC_URL}customer-reports/photos?url=${encodeURIComponent(photoUrl)}`);
  }
}
