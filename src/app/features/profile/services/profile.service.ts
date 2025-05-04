import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';
import { ProfileInterface } from '../interfaces/profile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  getProfile() : Observable<ProfileInterface> {
    return this.http.get<ProfileInterface>(`${this.apiUrl}/user`);
  }

  updateProfile(data: ProfileInterface) {
    return this.http.put(`${this.apiUrl}/user`, data);
  }

  updatePassword(data: { password: string, newPassword: string }) {
    return this.http.put(`${this.apiUrl}/user/update-password`, data);
  }
}
