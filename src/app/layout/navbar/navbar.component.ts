import { Component } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private authService: AuthService
  ){
  }
  logout(){
    this.authService.logout();
  }
}
