import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VehiclesComponent } from './vehicles-folder/vehicles/vehicles.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './services/auth/guard/auth.guard';
import { firstTimeSetupGuard } from './services/auth/guard/first-time-setup.guard';
import { requireFirstTimeSetupGuard } from './services/auth/guard/require-first-time-setup.guard';
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
import { ResetPasswordComponent } from './services/reset-password/reset-password/reset-password.component';
import { ForgottenPasswordComponent } from './services/forgotten-password/forgotten-password/forgotten-password.component';
import { SendForgottenPasswordEmail } from './login/send-forgotten-password-email/send-forgotten-password-email/send-forgotten-password-email.component';
import { UserAdminViewComponent } from './admin/Users/user-admin-view/user-admin-view/user-admin-view.component';
import { AdminOptionsComponent } from './admin/admin-options/admin-options.component';
import { RevenueComponent } from './admin/revenue/revenue.component';
import { EmailCustomerComponent } from './admin/email-customer/email-customer.component';
import { VacationRequestsComponent } from './vacation-folder/vacation-requests/vacation-requests.component';
import { VacationAdminComponent } from './vacation-folder/vacation-admin/vacation-admin.component';
import { FirstTimeSetupComponent } from './first-time-setup/first-time-setup.component';
import { CustomerReportListComponent } from './customer-reports/customer-report-list/customer-report-list.component';
import { CustomerReportDetailComponent } from './customer-reports/customer-report-detail/customer-report-detail.component';
import { CustomerReportFormComponent } from './customer-reports/customer-report-form/customer-report-form.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'dashboard',
        component: HomeComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "vehicles",
        component: VehiclesComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'vehicles/:id',
        component: VehicleDetailComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'vehicles/customer/:customerId',
        component: VehiclesComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'services/vehicle/:vehicleId',
        component: ServicesComponentsComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "create-vehicle",
        component: CreateVehicleComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "customers",
        component: CustomersComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'customers/:id',
        component: CustomerDetailComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "create-customer",
        component: CreateCustomerComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "services",
        component: ServicesComponentsComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "create-service",
        component: CreateServiceComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "service",
        component: CreateServiceComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'services/:id',
        component: ServiceDetailComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },


    {
        path: "progress",
        component: ProgressCircleComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },


    {
        path: "admin-users",
        component: AdminComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "create-user",
        component: CreateUserComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "update-user",
        component: UserDetailsComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "users/:id",
        component: UserAdminViewComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "create-service-type",
        component: ServiceTypeCreateComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'service-types/:id',
        component: ServiceTypeDetailsComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'service-types',
        component: ServiceTypesComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "revenue",
        component: RevenueComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'service-types/service/:serviceId',
        component: ServiceTypesComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: 'create-service/vehicle/:vehicleId',
        component: CreateServiceComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },
    
    {
        path: "login",
        component: LoginComponent
    },

    {
        path: "auth-callback",
        component: LoginComponent
    },

    {
        path: "first-time-setup",
        component: FirstTimeSetupComponent,
        canActivate: [authGuard, firstTimeSetupGuard]
    },

    {
        path: "change-password",
        component: ResetPasswordComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    
    {
        path: "admin-options",
        component: AdminOptionsComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
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
        component: EmailCustomerComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "vacation-requests",
        component: VacationRequestsComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "vacation-admin",
        component: VacationAdminComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "customer-reports",
        component: CustomerReportListComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "customer-reports/new",
        component: CustomerReportFormComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    {
        path: "customer-reports/:id",
        component: CustomerReportDetailComponent,
        canActivate: [authGuard, requireFirstTimeSetupGuard]
    },

    { path: '**', redirectTo: '/' }
];
