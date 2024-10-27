import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../../services/logout/logout.service';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router, 
    private logOutService: LogoutService,
    private userStorageService: UserStorageService) {}

  navigateToHome() {
    this.router.navigate(['']); 
  }

  navigateToVehicles() {
    this.router.navigate(['vehicles']); 
  }

  navigateToCustomers() {
    this.router.navigate(['customers']); 
  }

  navigateToServices() {
    this.router.navigate(['services']); 
  }

  isLoggedIn(): boolean {
    return this.userStorageService.getToken() !== null; 
  }

 LogOut() {
    this.logOutService.logout();
    this.router.navigate(['login']); 
  }
}