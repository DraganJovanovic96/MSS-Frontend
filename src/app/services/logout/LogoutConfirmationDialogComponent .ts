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
      text-align: center; 
      margin: 0; 
    }
    .spacer {
      flex-grow: 1;
    }
    .logout-button {
      background-color: #454442 !important; 
      color: white !important; 
      border-radius: 20px; 
    }
    .logout-button:hover {
      background-color: #666666 !important; 
    }
    .logout-button:focus {
      outline: none;
    }
    .cancel-button{
      border-radius: 20px;
    }
  `]
})
export class LogoutConfirmationDialogComponent { }
