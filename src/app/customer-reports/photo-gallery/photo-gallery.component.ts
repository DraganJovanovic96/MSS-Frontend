import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ImageLightboxComponent } from './image-lightbox/image-lightbox.component';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent {
  @Input() photoUrls: string[] = [];
  @Input() readonly = true;
  @Output() photoRemoved = new EventEmitter<number>();

  constructor(private dialog: MatDialog) {}

  openLightbox(index: number): void {
    const dialogRef = this.dialog.open(ImageLightboxComponent, {
      data: {
        photos: this.photoUrls,
        startIndex: index
      },
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'image-lightbox-dialog'
    });
  }

  removePhoto(index: number): void {
    if (!this.readonly) {
      this.photoRemoved.emit(index);
    }
  }

  downloadPhoto(url: string, index: number): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = `damage-report-photo-${index + 1}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  hasPhotos(): boolean {
    return this.photoUrls.length > 0;
  }
}
