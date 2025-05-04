import { Component } from '@angular/core';
import { PasswordComponent } from './password/password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

@Component({
  selector: 'app-profile',
  imports: [ PasswordComponent, UpdateProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  
  
}
