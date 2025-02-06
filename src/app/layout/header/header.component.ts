import { Component, OnInit, HostListener } from '@angular/core';
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
  isMobileMenuOpen = false;
  activeDropdown: string | null = null;
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

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.activeDropdown = null;
  }

  toggleDropdown(dropdown: string) {
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.activeDropdown = null;
  }

  navigateToHome() {
    this.closeMobileMenu();
    this.router.navigate(['']);
  }

  navigateToCustomers() {
    this.closeMobileMenu();
    this.router.navigate(['customers']);
  }

  navigateToVehicles() {
    this.closeMobileMenu();
    this.router.navigate(['vehicles']);
  }

  isLoggedIn(): boolean {
    return this.userStorageService.getToken() !== null;
  }

  LogOut() {
    this.logOutService.logout();
    this.closeMobileMenu();
  }

  isAdmin() {
    const user = this.userStorageService.getUser();
    if (user) {
      const parsedUser = JSON.parse(user as string);
      return parsedUser.role === 'ADMIN';
    }
    return false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.header') && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
