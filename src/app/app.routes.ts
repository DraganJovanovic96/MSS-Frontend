import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './services/auth/guard/auth.guard';

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
        path: "login",
        component: LoginComponent
    },

    { path: '**',redirectTo: '/' }
];
