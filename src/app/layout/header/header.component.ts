import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../../services/logout/logout.service';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { UserStateService } from '../../services/auth/user.state.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  vehiclesDropdownOpen = false;
  customerDropdownOpen = false;
  userImage: string | null = null;
  readonly fallbackImageUrl: string = 'https://i.imghippo.com/files/hzQF7597pHY.jpg';

  constructor(
    private router: Router,
    private logOutService: LogoutService,
    private userStorageService: UserStorageService,
    private userStateService: UserStateService
  ) { }

  ngOnInit(): void {
    this.userImage = this.userStateService.getUserImage() || this.fallbackImageUrl;

    this.userStateService.userImage$.subscribe((image) => {
      this.userImage = image || this.fallbackImageUrl;
    });
  }

  navigateToHome() {
    this.router.navigate(['']);
  }

  navigateToCustomers() {
    this.router.navigate(['customers']);
  }

  navigateToVehicles() {
    this.router.navigate(['vehicles']);
    this.vehiclesDropdownOpen = false;
  }

  navigateToCreateVehicle() {
    this.router.navigate(['create-vehicle']);
    this.vehiclesDropdownOpen = false;
  }

  navigateToCreateCustomer() {
    this.router.navigate(['create-customer']);
    this.customerDropdownOpen = false;
  }

  navigateToServices() {
    this.router.navigate(['services']);
  }

  navigateToCreateService() {
    this.router.navigate(['create-service']);
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

  toggleCustomersDropdown() {
    this.customerDropdownOpen = !this.customerDropdownOpen;
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
