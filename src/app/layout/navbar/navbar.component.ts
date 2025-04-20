import { Component, signal } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { ProfileSharedService } from '../../core/services/profile-shared.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  profileImgPath: string | null = null; // Initialize with null or a default image path
  themeSave = signal('');
  constructor(
    private authService: AuthService,
    private profileSharedService: ProfileSharedService
  ){
  }

  ngOnInit(): void {
    this.profileSharedService.profileImageUrl$.subscribe((url) => {
      if (url) {
        this.profileImgPath = url;
      }
    });
    const theme = localStorage.getItem('theme')
    if(theme){
      this.themeSave.set(theme);
    }else{
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.themeSave.set(prefersDarkScheme ? 'dim' : 'corporate');
    }
  }
  logout(){
    this.authService.logout();
    this.profileSharedService.clearProfileImage();
  }

  togleTheme() {
    const newTheme = this.themeSave() === 'corporate' ? 'dim' : 'corporate';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.themeSave.set(newTheme);
  }

}
