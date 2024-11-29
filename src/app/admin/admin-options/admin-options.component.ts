import { Component } from '@angular/core';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-options',
  standalone: true,
  imports: [SidebarComponent,  MatCardModule],
  templateUrl: './admin-options.component.html',
  styleUrl: './admin-options.component.scss'
})
export class AdminOptionsComponent {

}
