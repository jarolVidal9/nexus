import { Component } from '@angular/core';
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
  }
  logout(){
    this.authService.logout();
  }
}
