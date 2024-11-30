import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EmailCustomerComponent } from '../admin/email-customer/email-customer.component';

@Component({
  selector: 'app-customer-vehicle-dialog',
  standalone: true, 
  template: `
    <h2 mat-dialog-title>Send service over email to:</h2>
    <mat-dialog-content>
      <p><strong><i class="fa fa-user"></i> Customer:</strong> {{ data.customer.firstname }} {{ data.customer.lastname }}</p>
      <p><strong><i class="fa fa-envelope"></i> Email:</strong> {{ data.customer.email }}</p>
      <p><strong><i class="fa fa-phone"></i> Phone:</strong> {{ data.customer.phoneNumber }}</p>
      <p><strong><i class="fa fa-car"></i> Vehicle:</strong> {{ data.vehicle.manufacturer }} {{ data.vehicle.model }}</p>
      <p><strong><i class="fa fa-receipt"></i> Invoice:</strong> {{ data.service.invoiceCode }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close class="cancel-button">Cancel</button>
      <button mat-button class="send-button" (click)="sendEmail()">Send</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./customer-vehicle-dialog.component.scss'],
  imports: [
    MatDialogModule, 
    MatButtonModule,
  ],
})
export class CustomerVehicleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomerVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private emailService: EmailCustomerComponent
  ) {}

  sendEmail(): void {
    const emailCustomerDto = {
      customerName: this.data.customer.firstname + ' ' + this.data.customer.lastname,
      customerEmail: this.data.customer.email,
      vehicleManufacturerAndModel: this.data.vehicle.manufacturer + ' ' + this.data.vehicle.model,
      invoiceCode: this.data.service.invoiceCode,
    };
  
    this.emailService.sendEmailService(emailCustomerDto);
    this.dialogRef.close();
  }
}
