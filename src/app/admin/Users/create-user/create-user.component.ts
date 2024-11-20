import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

const BASIC_URL = 'http://localhost:8080/api/v1/';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})

export class CreateUserComponent implements OnInit {
  @ViewChild('createUserForm', { static: false }) createUserForm!: NgForm;

  isDeleted: boolean = false;
  passwordVisible = false;
  repeatPasswordVisible = false;
  capsLockOn = false;
  isEditingImage = false;
  blurredEmail = false;
  blurredMobileNumber = false;
  blurredPassword = false;
  blurredRepeatPassword = false;
  emailPattern: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  passwordPattern: string = "^(?=(.*[a-zA-Z]))(?=(.*[0-9]))[a-zA-Z0-9]{6,}$";

  registerRequestDto: any = {
    createdAt: '',
    updatedAt: '',
    deleted: '',
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    mobileNumber: '',
    password: '',
    repeatPassword: '',
    imageUrl: '',
    dateOfBirth: null
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.checkCapsLockStatusOnInit();
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

  toggleImageEdit(): void {
    this.isEditingImage = !this.isEditingImage;
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement): void {
    const clickedInsideInput = targetElement.matches('.image-url-input input');
    const clickedInsideIcon = targetElement.closest('.edit-icon');

    if (!clickedInsideInput && !clickedInsideIcon && this.isEditingImage) {
      this.isEditingImage = false;
    }
  }

  createUser(): void {
    if (this.createUserForm.invalid) {
      Object.keys(this.createUserForm.controls).forEach((field) => {
        const control = this.createUserForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });

      this.snackBar.open('Please fix the errors in the form.', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
      });
      return;
    }

    const createdUser = { ...this.registerRequestDto, deleted: this.isDeleted };

    if (this.registerRequestDto.password !== this.registerRequestDto.repeatPassword) {
      this.snackBar.open('Passwords do not match!', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
      });
      return;
    }

    this.http.post<any>(`${BASIC_URL}register`, createdUser).subscribe({
      next: () => {
        this.snackBar.open('User created successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => console.error('Error creating user:', error),
    });
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
    this.registerRequestDto.mobileNumber = this.registerRequestDto.mobileNumber.replace(/[^0-9+\-()\s]/g, '');
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
