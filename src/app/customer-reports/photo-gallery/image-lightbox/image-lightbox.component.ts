import { Component, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface LightboxData {
  photos: string[];
  startIndex: number;
}

@Component({
  selector: 'app-image-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-lightbox.component.html',
  styleUrls: ['./image-lightbox.component.scss']
})
export class ImageLightboxComponent implements AfterViewInit {
  currentIndex: number;
  imageScale: number = 1;
  @ViewChild('lightboxImage') lightboxImage!: ElementRef<HTMLImageElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: LightboxData,
    private dialogRef: MatDialogRef<ImageLightboxComponent>
  ) {
    this.currentIndex = data.startIndex || 0;
  }

  ngAfterViewInit(): void {
    this.calculateImageScale();
  }

  calculateImageScale(): void {
    const img = this.lightboxImage?.nativeElement;
    if (!img) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 160; // Space for navigation buttons and UI

    img.onload = () => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const availableWidth = viewportWidth - padding;
      const availableHeight = viewportHeight - padding;

      const scaleX = availableWidth / imgWidth;
      const scaleY = availableHeight / imgHeight;

      this.imageScale = Math.min(scaleX, scaleY, 1);
    };

    if (img.complete && img.naturalWidth) {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const availableWidth = viewportWidth - padding;
      const availableHeight = viewportHeight - padding;

      const scaleX = availableWidth / imgWidth;
      const scaleY = availableHeight / imgHeight;

      this.imageScale = Math.min(scaleX, scaleY, 1);
    }
  }

  get currentPhoto(): string {
    return this.data.photos[this.currentIndex];
  }

  get totalPhotos(): number {
    return this.data.photos.length;
  }

  nextPhoto(): void {
    if (this.currentIndex < this.totalPhotos - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to first
    }
    this.calculateImageScale();
  }

  previousPhoto(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.totalPhotos - 1; // Loop to last
    }
    this.calculateImageScale();
  }

  close(): void {
    this.dialogRef.close();
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
        this.nextPhoto();
        break;
      case 'ArrowLeft':
        this.previousPhoto();
        break;
      case 'Escape':
        this.close();
        break;
    }
  }
}
