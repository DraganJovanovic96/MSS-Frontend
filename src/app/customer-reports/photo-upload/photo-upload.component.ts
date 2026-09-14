import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { PhotoUploadService } from '../../services/photo-upload/photo-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ImageLightboxComponent } from '../photo-gallery/image-lightbox/image-lightbox.component';

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressBarModule],
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent {
  @Output() photosChange = new EventEmitter<File[]>();
  @Output() photoUrlsChange = new EventEmitter<string[]>();
  @Input() existingPhotoUrls: string[] = [];
  @Input() maxPhotos: number = 10;
  @Input() maxFileSize: number = 5 * 1024 * 1024; // 5MB

  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  uploadProgress: { [key: string]: number } = {};
  isUploading = false;

  constructor(
    private photoUploadService: PhotoUploadService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  triggerFileInput(): void {
    const fileInput = document.querySelector('.hidden-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);

    this.processFiles(files);
    input.value = '';
  }

  processFiles(files: File[]): void {
    if (this.selectedFiles.length + files.length > this.maxPhotos) {
      this.snackBar.open(`Maximum ${this.maxPhotos} photos allowed`, 'Close', { duration: 3000 });
      return;
    }

    files.forEach(file => {
      if (file.size > this.maxFileSize) {
        this.snackBar.open(`File ${file.name} exceeds ${this.maxFileSize / 1024 / 1024}MB limit`, 'Close', { duration: 3000 });
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.snackBar.open(`File ${file.name} is not an image`, 'Close', { duration: 3000 });
        return;
      }

      this.selectedFiles.push(file);
      this.createPreview(file);
    });

    this.photosChange.emit(this.selectedFiles);
  }

  createPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.previewUrls.push(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  removePhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.photosChange.emit(this.selectedFiles);
  }

  removeExistingPhoto(index: number): void {
    const removedUrl = this.existingPhotoUrls[index];
    this.existingPhotoUrls.splice(index, 1);
    this.photoUrlsChange.emit(this.existingPhotoUrls);

    this.photoUploadService.deletePhoto(removedUrl).subscribe({
      error: (error) => console.error('Error deleting photo:', error)
    });
  }

  viewPhoto(url: string): void {
    window.open(url, '_blank');
  }

  viewPhotoFromPreview(url: string): void {
    const allPhotos = [...this.existingPhotoUrls, ...this.previewUrls];
    const index = allPhotos.indexOf(url);
    this.dialog.open(ImageLightboxComponent, {
      data: {
        photos: allPhotos,
        startIndex: index >= 0 ? index : 0
      },
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'image-lightbox-dialog'
    });
  }

  uploadPhotos(reportId?: number): Observable<string[]> {
    if (this.selectedFiles.length === 0) {
      return new Observable(observer => {
        observer.next(this.existingPhotoUrls);
        observer.complete();
      });
    }

    this.isUploading = true;

    return new Observable(observer => {
      this.photoUploadService.uploadPhotos(this.selectedFiles, reportId).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            this.uploadProgress['overall'] = progress;
          } else if (event.type === HttpEventType.Response) {
            const photoUrls = event.body?.photoUrls || [];
            this.isUploading = false;
            observer.next([...this.existingPhotoUrls, ...photoUrls]);
            observer.complete();
          }
        },
        error: (error) => {
          this.isUploading = false;
          this.snackBar.open('Error uploading photos', 'Close', { duration: 3000 });
          observer.error(error);
        }
      });
    });
  }

  hasPhotos(): boolean {
    return this.selectedFiles.length > 0 || this.existingPhotoUrls.length > 0;
  }

  totalPhotos(): number {
    return this.selectedFiles.length + this.existingPhotoUrls.length;
  }

  addFileDirectly(file: File): void {
    this.processFiles([file]);
  }
}
