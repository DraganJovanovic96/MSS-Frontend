import { Component, HostListener, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../../layout/sidebar/sidebar.component';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteConfirmationDialogComponent } from '../../../../services/DeleteConfirmationDialogComponent ';
import { environment } from '../../../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-user-admin-view',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent],
  templateUrl: './user-admin-view.component.html',
  styleUrl: './user-admin-view.component.scss'
})
export class UserAdminViewComponent implements OnInit {
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
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.user.id = userId;
    this.getUser();
  }

  updateUser(): void {
    const updatedUser = { ...this.user, deleted: this.user.isDeleted };
    this.http.put<any>(`${BASIC_URL}users/id/{userId}`, updatedUser).subscribe({
      next: () => {
        this.snackBar.open('User status updated successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/admin']);
      },
      error: (error) => console.error('Error updating user:', error)
    });
  }

  getUser(): void {
    this.http.get<any>(`${BASIC_URL}users/id/${this.user.id}`).subscribe({
      next: (data) => {
        console.log(data);
        this.user = { ...this.user, ...data };
        this.user.isDeleted = data.deleted;
      },
      error: (error) => console.error(`Error fetching User`, error)
    });
  }

  deleteUser(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete<any>(`${BASIC_URL}users/id/${id}`).subscribe({
          next: () => {
            this.snackBar.open('User deleted successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom'
            });
            this.router.navigate(['/admin']);
          },
          error: (error) => {
            if (error.status === 404) {
              this.snackBar.open('User not found. Redirecting to admin.', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom'
              });
              this.router.navigate(['/admin']);
            } else {
              console.error(`Error deleting user with ID ${id}:`, error);
              this.snackBar.open('Error deleting user. Please try again.', 'Close', {
                duration: 3000,
                verticalPosition: 'bottom'
              });
            }
          }
        });
      }
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
