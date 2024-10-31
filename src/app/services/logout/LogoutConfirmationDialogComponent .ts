import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logout-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">Confirm Logout</h2>
    <mat-dialog-content>Are you sure you want to log out?</mat-dialog-content>
    <mat-dialog-actions>
      <button class="cancel-button" mat-flat-button [mat-dialog-close]="false">Cancel</button>
      <div class="spacer"></div>
      <button mat-flat-button class="logout-button" [mat-dialog-close]="true">Log Out</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      text-align: center; /* Center the text */
      margin: 0; /* Remove default margin to keep it aligned */
    }
    .spacer {
      flex-grow: 1; /* Takes available space to push the Log Out button to the right */
    }
    .logout-button {
      background-color: #FFA500 !important; /* Custom color */
      color: white !important; /* Text color */
      border-radius: 20px; /* Set the border radius for rounded edges */
    }
    .logout-button:hover {
      background-color: #FF8C00 !important; /* Darker shade on hover */
    }
    .logout-button:focus {
      outline: none; /* Remove focus outline */
    }
    .cancel-button{
      border-radius: 20px;
    }
  `]
})
export class LogoutConfirmationDialogComponent { }
