import { Component, HostListener, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  isEditingImage = false;
  isDeleted: boolean = false;
  passwordVisible = false;
  repeatPasswordVisible = false;
  capsLockOn = false;
  blurredEmail = false;
  blurredMobileNumber = false;
  blurredPassword = false;
  blurredRepeatPassword = false;
  emailPattern: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  passwordPattern: string = "^(?=(.*[a-zA-Z]))(?=(.*[0-9]))[a-zA-Z0-9]{6,}$";

  user: any = {
    createdAt: '',
    updatedAt: '',
    deleted: '',
    firstname: '',
    lastname: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: null,
    address: '',
    imageUrl: ''
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  updateUser(): void {
    const updatedUser = { ...this.user, deleted: this.user.isDeleted };
    this.http.put<any>(`${BASIC_URL}users/user-details-update`, updatedUser).subscribe({
      next: () => {
        this.snackBar.open('User status updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => console.error('Error updating user:', error)
    });
  }

  getUser(): void {
    this.http.get<any>(`${BASIC_URL}users/user-details`).subscribe({
      next: (data) => {
        this.user = { ...this.user, ...data };
        this.user.isDeleted = data.deleted;
      },
      error: (error) => console.error(`Error fetching User`, error)
    });
  }


  toggleImageEdit(): void {
    this.isEditingImage = !this.isEditingImage;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleRepeatPasswordVisibility(): void {
    this.repeatPasswordVisible = !this.repeatPasswordVisible;
  }

  checkCapsLockStatusOnInit(): void {
    document.addEventListener('keydown', (event) => {
      this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    });
  }

  checkCapsLock(event: KeyboardEvent): void {
    this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement): void {
    const clickedInsideInput = targetElement.matches('.image-url-input input');
    const clickedInsideIcon = targetElement.closest('.edit-icon');

    if (!clickedInsideInput && !clickedInsideIcon && this.isEditingImage) {
      this.isEditingImage = false;
    }
  }

  onEmailBlur() {
    this.blurredEmail = true;
  }

  onEmailFocus(): void {
    this.blurredEmail = false;
  }

  onMobileNumberBlur() {
    this.blurredMobileNumber = true;
  }

  onMobileNumberFocus(): void {
    this.blurredMobileNumber = false;
  }

  validatePhoneNumber(event: KeyboardEvent): void {
    const allowedCharacters = /^[0-9+\-()s]*$/;
    const inputCharacter = event.key;
    if (!allowedCharacters.test(inputCharacter)) {
      event.preventDefault();
    }
  }

  sanitizePhoneNumber(): void {
    this.user.mobileNumber = this.user.mobileNumber.replace(/[^0-9+\-()\s]/g, '');
  }

  onPasswordBlur() {
    this.blurredPassword = true;
  }

  onPasswordFocus(): void {
    this.blurredPassword = false;
  }

  onRepeatPasswordBlur() {
    this.blurredRepeatPassword = true;
  }

  onRepeatPasswordFocus(): void {
    this.blurredRepeatPassword = false;
  }

}
