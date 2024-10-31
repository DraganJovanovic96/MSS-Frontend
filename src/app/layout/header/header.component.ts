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
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  vehiclesDropdownOpen = false;

  constructor(
    private router: Router,
    private logOutService: LogoutService,
    private userStorageService: UserStorageService
  ) { }

  navigateToHome() {
    this.router.navigate(['']);
  }

  navigateToCustomers() {
    this.router.navigate(['customers']);
  }
  
  navigateToVehicles() {
    this.router.navigate(['vehicles']);
    this.vehiclesDropdownOpen = false; // Close dropdown after navigation
  }

  navigateToCreateVehicle() {
    this.router.navigate(['create-vehicle']);
    this.vehiclesDropdownOpen = false; // Close dropdown after navigation
  }

  navigateToServices() {
    this.router.navigate(['services']);
  }

  navigateToAdmin() {
    this.router.navigate(['admin']);
  }

  isLoggedIn(): boolean {
    return this.userStorageService.getToken() !== null;
  }

  toggleVehiclesDropdown() {
    this.vehiclesDropdownOpen = !this.vehiclesDropdownOpen;
  }

  LogOut() {
    this.logOutService.logout();
  }

  isAdmin() {
    const user = this.userStorageService.getUser();
    if (user) {
      const parsedUser = JSON.parse(user as string);
      return parsedUser.role === 'ADMIN';
    }

    return false;
  }
}
