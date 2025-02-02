import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VehiclesComponent } from './vehicles-folder/vehicles/vehicles.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './services/auth/guard/auth.guard';
import { CustomersComponent } from './customer-folder/customers/customers.component';
import { ServicesComponentsComponent } from './service-folder/services-components/services-components.component';
import { AdminComponent } from './admin/admin.component';
import { ProgressCircleComponent } from './progress-circle/progress-circle.component';
import { VehicleDetailComponent } from './vehicles-folder/vehicle-detail/vehicle-detail.component';
import { CreateVehicleComponent } from './vehicles-folder/create-vehicle/create-vehicle.component';
import { CustomerDetailComponent } from './customer-folder/customer-detail/customer-detail.component';
import { CreateCustomerComponent } from './customer-folder/create-customer/create-customer.component';
import { CreateServiceComponent } from './service-folder/create-service/create-service.component';
import { ServiceDetailComponent } from './service-folder/service-detail/service-detail.component';
import { CreateUserComponent } from './admin/Users/create-user/create-user.component';
import { UserDetailsComponent } from './admin/Users/user-details/user-details.component';
import { ServiceTypeCreateComponent } from './service-type-folder/service-type-create/service-type-create.component';
import { ServiceTypeDetailsComponent } from './service-type-folder/service-type-details/service-type-details.component';
import { ServiceTypesComponent } from './service-type-folder/service-types/service-types.component';
import { EmailVerificationComponent } from './login/email-verification-folder/email-verification/email-verification.component';
import { ResetPasswordComponent } from './services/reset-password/reset-password/reset-password.component';
import { ResendVerificationEmailComponent } from './login/resend-email-verification-folder/resend-verification-email/resend-verification-email.component';
import { ForgottenPasswordComponent } from './services/forgotten-password/forgotten-password/forgotten-password.component';
import { SendForgottenPasswordEmail } from './login/send-forgotten-password-email/send-forgotten-password-email/send-forgotten-password-email.component';
import { UserAdminViewComponent } from './admin/Users/user-admin-view/user-admin-view/user-admin-view.component';
import { AdminOptionsComponent } from './admin/admin-options/admin-options.component';
import { RevenueComponent } from './admin/revenue/revenue.component';
import { EmailCustomerComponent } from './admin/email-customer/email-customer.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        // canActivate: [authGuard]
    },

    {
        path: 'dashboard',
        component: HomeComponent,
        // canActivate: [authGuard]
    },

    {
        path: "vehicles",
        component: VehiclesComponent,
        // canActivate: [authGuard]
    },

    {
        path: 'vehicles/:id',
        component: VehicleDetailComponent,
    },

    {
        path: 'vehicles/customer/:customerId',
        component: VehiclesComponent
    },

    {
        path: 'services/vehicle/:vehicleId',
        component: ServicesComponentsComponent
    },

    {
        path: "create-vehicle",
        component: CreateVehicleComponent,
        canActivate: [authGuard]
    },

    {
        path: "customers",
        component: CustomersComponent,
        // canActivate: [authGuard]
    },

    {
        path: 'customers/:id',
        component: CustomerDetailComponent,
        // canActivate: [authGuard]
    },

    {
        path: "create-customer",
        component: CreateCustomerComponent,
        canActivate: [authGuard]
    },

    {
        path: "services",
        component: ServicesComponentsComponent,
        canActivate: [authGuard]
    },

    {
        path: "create-service",
        component: CreateServiceComponent,
        canActivate: [authGuard]
    },

    {
        path: "service",
        component: CreateServiceComponent,
        canActivate: [authGuard]
    },

    {
        path: 'services/:id',
        component: ServiceDetailComponent,
        canActivate: [authGuard]
    },


    {
        path: "progress",
        component: ProgressCircleComponent,
        canActivate: [authGuard]
    },


    {
        path: "admin-users",
        component: AdminComponent,
        canActivate: [authGuard]
    },

    {
        path: "create-user",
        component: CreateUserComponent,
        canActivate: [authGuard]
    },

    {
        path: "update-user",
        component: UserDetailsComponent,
        canActivate: [authGuard]
    },

    {
        path: "users/:id",
        component: UserAdminViewComponent,
        canActivate: [authGuard]
    },

    {
        path: "create-service-type",
        component: ServiceTypeCreateComponent,
        canActivate: [authGuard]
    },

    {
        path: 'service-types/:id',
        component: ServiceTypeDetailsComponent,
        canActivate: [authGuard]
    },

    {
        path: 'service-types',
        component: ServiceTypesComponent,
        canActivate: [authGuard]
    },

    {
        path: "revenue",
        component: RevenueComponent
    },

    {
        path: 'service-types/service/:serviceId',
        component: ServiceTypesComponent
    },

    {
        path: 'create-service/vehicle/:vehicleId',
        component: CreateServiceComponent
    },
    
    {
        path: "login",
        component: LoginComponent
    },

    {
        path: "change-password",
        component: ResetPasswordComponent,
        canActivate: [authGuard]
    },

    
    {
        path: "admin-options",
        component: AdminOptionsComponent,
        canActivate: [authGuard]
    },

    {
        path: "reset-password",
        component: ForgottenPasswordComponent
    },

    {
        path: "send-password-reset",
        component: SendForgottenPasswordEmail
    },

    {
        path: "email",
        component: EmailCustomerComponent
    },

    {
        path: "verify",
        component: EmailVerificationComponent
    },

    {
        path: "resend-email",
        component: ResendVerificationEmailComponent
    },

    { path: '**', redirectTo: '/' }
];
