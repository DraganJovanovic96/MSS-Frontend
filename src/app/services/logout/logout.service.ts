import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationDialogComponent } from './LogoutConfirmationDialogComponent ';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(private dialog: MatDialog, private router: Router) { }

  logout() {
    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If the user confirms logout, remove tokens and redirect to login
        window.localStorage.removeItem('mss-token');
        window.localStorage.removeItem('mss-refresh-token');
        window.localStorage.removeItem('mss-user');
        this.router.navigate(['/login']);
      }
      // If result is false (user canceled), do nothing; they stay on the same page.
    });
  }
}
