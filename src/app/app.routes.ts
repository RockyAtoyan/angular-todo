import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoomComponent } from './pages/room/room.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './ui/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
      {
        path: 'room/:id',
        component: RoomComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
      },
    ],
  },
  { path: 'signup', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
];
