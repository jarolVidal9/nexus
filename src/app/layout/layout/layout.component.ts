import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DockComponent } from '../dock/dock.component';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, RouterOutlet, DockComponent ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
