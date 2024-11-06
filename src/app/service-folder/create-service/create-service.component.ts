import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, SidebarComponent],
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss'
})
export class CreateServiceComponent {
  isDeleted: boolean = false;

  services: any[] = [];

  service: any = {
    id: null,
    invoiceCode: '',
    startDate: null,
    endDate: null,
    currentMileage: null,
    nextServiceMileage: null,
    vehicleDto: {
      manufacturer: '',
      model: ''
    },
    userDto: {
      firstname: '',
      lastname: ''
    }
  };

  createCustomer() {
    
  }

}
