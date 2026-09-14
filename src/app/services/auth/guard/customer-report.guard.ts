import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserStorageService } from '../../storage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerReportGuard implements CanActivate {
  constructor(
    private userStorageService: UserStorageService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = this.userStorageService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const parsedUser = JSON.parse(user);
    const role = parsedUser.role;

    return true;
  }
}
