import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">Confirm Deletion</h2>
    <mat-dialog-content>Are you sure you want to delete this resource?</mat-dialog-content>
    <mat-dialog-actions>
      <button class="cancel-button" mat-flat-button [mat-dialog-close]="false">Cancel</button>
      <div class="spacer"></div>
      <button mat-flat-button class="logout-button" [mat-dialog-close]="true">Deletion</button>
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
      background-color: #FFA500 !important; 
      color: white !important; 
      border-radius: 20px; 
    }
    .logout-button:hover {
      background-color: #FF8C00 !important; 
    }
    .logout-button:focus {
      outline: none; 
    }
    .cancel-button{
      border-radius: 20px;
    }
  `]
})
export class DeleteConfirmationDialogComponent { }
