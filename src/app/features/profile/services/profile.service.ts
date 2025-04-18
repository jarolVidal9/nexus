import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../src/environments/environment';
import { Profile } from '../interfaces/profile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  getProfile() : Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/user`);
  }

  updateProfile(data: Profile) {
    return this.http.put(`${this.apiUrl}/user`, data);
  }

  updatePassword(data: { password: string, newPassword: string }) {
    return this.http.put(`${this.apiUrl}/user/update-password`, data);
  }
}
