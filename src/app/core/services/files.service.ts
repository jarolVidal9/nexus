import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
 private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{message: string, filename:string,path:string}>(`${this.apiUrl}/upload`, formData);
  }
  getRouteImage(filename: string) {
    return `${this.apiUrl}/uploads/${filename}`;
  }
}
