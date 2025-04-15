import { Component, signal } from '@angular/core';
import { NavbarComponent } from "../../../layout/navbar/navbar.component";
import { PasswordComponent } from './password/password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

@Component({
  selector: 'app-profile',
  imports: [NavbarComponent, PasswordComponent, UpdateProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  
  
}
