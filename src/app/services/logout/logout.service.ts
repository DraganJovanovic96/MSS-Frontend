import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationDialogComponent } from './LogoutConfirmationDialogComponent ';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserStateService } from '../auth/user.state.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(private dialog: MatDialog, private authService: AuthService, private userStateService: UserStateService,
    private router: Router) { }

  logout() {
    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.userStateService.setUserImage(null);
      }
    });
  }
}
