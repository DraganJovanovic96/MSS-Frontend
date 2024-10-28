import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './services/auth/guard/auth.guard';
import { CustomersComponent } from './customers/customers.component';
import { ServicesComponentsComponent } from './services-components/services-components.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        canActivate: [authGuard]
    },
  
    {
        path: "vehicles",
        component: VehiclesComponent,
        canActivate: [authGuard]
    },

    {
        path: "customers",
        component: CustomersComponent,
        canActivate: [authGuard]
    },

    {
        path: "services",
        component: ServicesComponentsComponent,
        canActivate: [authGuard]
    },

    
    {
        path: "admin",
        component: AdminComponent,
        canActivate: [authGuard]
    },

    {
        path: "login",
        component: LoginComponent
    },

    { path: '**',redirectTo: '/' }
];
