import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileSharedService {
  private profileImageUrl = new BehaviorSubject<string | null>(this.getInitialImage());
  profileImageUrl$ = this.profileImageUrl.asObservable();

  private getInitialImage(): string | null {
    return localStorage.getItem('profileImage') || null;
  }

  setProfileImage(url: string) {
    this.profileImageUrl.next(url);
    localStorage.setItem('profileImage', url);
  }

  clearProfileImage() {
    this.profileImageUrl.next(null);
    localStorage.removeItem('profileImage');
  }
}
