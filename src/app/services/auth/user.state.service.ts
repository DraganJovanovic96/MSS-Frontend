import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private userImageSubject = new BehaviorSubject<string | null>(null);
  userImage$ = this.userImageSubject.asObservable();

  constructor(private userStorageService: UserStorageService) {
    const storedImage = this.userStorageService.getUserImage();
    if (storedImage) {
      this.userImageSubject.next(storedImage);
    }
  }

  setUserImage(image: string | null): void {
    this.userImageSubject.next(image);
  }

  getUserImage(): string | null {
    return this.userImageSubject.value;
  }
}
