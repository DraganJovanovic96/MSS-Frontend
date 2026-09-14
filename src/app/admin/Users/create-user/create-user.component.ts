import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerComponent } from '../../../spinner/spinner/spinner.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../../environments/environment';

const BASIC_URL = environment.apiUrl;

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule, SpinnerComponent, NgSelectModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})

export class CreateUserComponent implements OnInit {
  @ViewChild('createUserForm', { static: false }) createUserForm!: NgForm;

  isLoading: boolean = false;
  isDeleted: boolean = false;
  capsLockOn = false;
  blurredEmail = false;
  blurredMobileNumber = false;
  emailPattern: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  registerRequestDto: any = {
    createdAt: '',
    updatedAt: '',
    deleted: '',
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    mobileNumber: '',
    imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    dateOfBirth: null,
    numberOfChildren: 0,
    role: 'MECHANIC'
  };

  roles = [
    { name: 'ADMIN', value: 'ADMIN' },
    { name: 'MECHANIC', value: 'MECHANIC' },
    { name: 'RECEPTIONIST', value: 'RECEPTIONIST' }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.checkCapsLockStatusOnInit();
  }

  checkCapsLockStatusOnInit(): void {
    document.addEventListener('keydown', (event) => {
      this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    });
  }

  checkCapsLock(event: KeyboardEvent): void {
    this.capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
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

    this.isLoading = true;
    this.http.post<any>(`${BASIC_URL}register`, createdUser).subscribe({
      next: () => {
        this.snackBar.open('User created successfully! The user can now log in via Google.', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.isLoading = false;
      },
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
}
