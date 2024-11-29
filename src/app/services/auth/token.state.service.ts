import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStateService {
  private refreshAttempted = false;

  setRefreshAttempted(status: boolean): void {
    this.refreshAttempted = status;
  }

  getRefreshAttempted(): boolean {
    return this.refreshAttempted;
  }

  reset(): void {
    this.refreshAttempted = false;
  }
}
