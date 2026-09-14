import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-email-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="email-confirmation-dialog">
      <div class="dialog-header">
        <i class="fa fa-envelope"></i>
        <h2>Send Service Email</h2>
      </div>
      <div class="dialog-content">
        <p class="confirm-message">Do you want to send the service completion email to the customer?</p>
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Customer:</span>
            <span class="info-value">{{ data.customerName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ data.customerEmail }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Vehicle:</span>
            <span class="info-value">{{ data.vehicleInfo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Issue:</span>
            <span class="info-value">{{ data.issueDescription }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value status-badge">{{ data.status }}</span>
          </div>
        </div>
      </div>
      <div class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">Cancel</button>
        <button mat-button (click)="onConfirm()" class="confirm-button">Send Email</button>
      </div>
    </div>
  `,
  styles: `
    .email-confirmation-dialog {
      background: rgba(12, 14, 18, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 32px;
      max-width: 500px;
      margin: 0 auto;
    }
    ::ng-deep .mat-mdc-dialog-container {
      background: transparent !important;
      box-shadow: none !important;
    }
    ::ng-deep .mat-mdc-dialog-surface {
      background: transparent !important;
      box-shadow: none !important;
    }
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .dialog-header .fa-envelope {
      color: #00CDB0;
      font-size: 1.5rem;
    }
    .dialog-header h2 {
      color: #B0C4C7;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .dialog-content {
      margin-bottom: 24px;
    }
    .dialog-content .confirm-message {
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 24px 0;
      line-height: 1.6;
      font-size: 1rem;
    }
    .info-section {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .info-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .info-row:first-child {
      padding-top: 0;
    }
    .info-label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.95rem;
      font-weight: 400;
      text-align: right;
      max-width: 60%;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .status-badge {
      background: rgba(156, 39, 176, 0.2);
      color: #9C27B0;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .dialog-actions button {
      padding: 12px 24px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.3s;
    }
    .dialog-actions .cancel-button {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .dialog-actions .cancel-button:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
    .dialog-actions .confirm-button {
      background: rgba(0, 205, 176, 0.8);
      color: white;
      border: 1px solid rgba(0, 205, 176, 0.3);
    }
    .dialog-actions .confirm-button:hover {
      background: rgba(0, 205, 176, 0.95);
      border-color: rgba(0, 205, 176, 0.5);
    }

    @media (max-width: 768px) {
      .email-confirmation-dialog {
        padding: 1.5rem;
        max-width: 90vw;
        margin: 1rem;
      }
      .dialog-header {
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
      }
      .dialog-header h2 {
        font-size: 1.1rem;
      }
      .dialog-content {
        margin-bottom: 1rem;
      }
      .dialog-content .confirm-message {
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }
      .info-section {
        padding: 1rem;
      }
      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
        padding: 0.5rem 0;
      }
      .info-label {
        font-size: 0.8rem;
      }
      .info-value {
        font-size: 0.85rem;
        text-align: left;
        max-width: 100%;
      }
      .dialog-actions {
        flex-direction: column;
      }
      .dialog-actions button {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .email-confirmation-dialog {
        padding: 1rem;
        max-width: 95vw;
      }
      .dialog-header h2 {
        font-size: 1rem;
      }
      .dialog-content .confirm-message {
        font-size: 0.85rem;
      }
      .info-section {
        padding: 0.75rem;
      }
      .info-label {
        font-size: 0.75rem;
      }
      .info-value {
        font-size: 0.8rem;
      }
    }
  `
})
export class EmailConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmailConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
