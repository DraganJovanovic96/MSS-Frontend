import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LogoutService } from '../../services/logout/logout.service';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { UserStateService } from '../../services/auth/user.state.service';
import { SharedDataService } from '../../services/SharedDataService';
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
  isMobileSidebarOpen = false;
  activeDropdown: string | null = null;
  vehiclesDropdownOpen = false;
  customerDropdownOpen = false;
  userImage: string | null = null;
  userName = '';
  readonly fallbackImageUrl: string = 'https://i.imghippo.com/files/hzQF7597pHY.jpg';

  constructor(
    private router: Router,
    private logOutService: LogoutService,
    private userStorageService: UserStorageService,
    private userStateService: UserStateService,
    private sharedDataService: SharedDataService
  ) { }

  ngOnInit(): void {
    this.userImage = this.userStateService.getUserImage() || this.fallbackImageUrl;
    this.userName = this.getUserDisplayName();
    this.userStateService.userImage$.subscribe((image) => {
      this.userImage = image || this.fallbackImageUrl;
      this.userName = this.getUserDisplayName();
    });
  }

  private getUserDisplayName(): string {
    const user = this.userStorageService.getUser();
    if (!user) {
      return '';
    }

    try {
      const parsedUser = JSON.parse(user as string);
      return [parsedUser.firstname, parsedUser.lastname].filter(Boolean).join(' ');
    } catch {
      return '';
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.activeDropdown = null;
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    this.sharedDataService.setMobileSidebarOpen(this.isMobileSidebarOpen);
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
    const user = this.userStorageService.getUser();
    return user !== null;
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

  hasCompletedFirstTimeSetup(): boolean {
    return this.userStorageService.isFirstTimeSetupCompleted();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.header') && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (this.userImage !== this.fallbackImageUrl) {
      img.src = this.fallbackImageUrl;
    }
  }
}
