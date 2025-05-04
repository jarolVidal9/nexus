import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterInterface } from '../interfaces/register.interface';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router:Router) { }

  login(credentials: { email: string, password: string }): Observable<{accessToken: string, refreshToken : string}> {
    return this.http.post<{accessToken: string, refreshToken : string}>(`${this.apiUrl}/auth/login`, credentials).pipe(
      map((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response;
      }
    ));
  }
    
  logout(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/auth/login']);
  }

  register(data: RegisterInterface){
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }
  resetPassword(email: string){
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { email });
  }
  verifyResetPassword(token: string, password: string){
    return this.http.post(`${this.apiUrl}/auth/reset-password/${token}`, { password });
  }
  userData(): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${this.apiUrl}/user`);
  }
}
