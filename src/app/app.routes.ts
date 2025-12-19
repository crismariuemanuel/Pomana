import { Routes } from '@angular/router';

import { AddCauseComponent } from './features/add-cause/add-cause.component';
import { CauseDetailsComponent } from './features/cause-details/cause-details.component';
import { HomeComponent } from './features/home/home.component';
import { AllCausesComponent } from './features/all-causes/all-causes.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DevelopComponent } from './features/admin/develop/develop.component';
import { AdminReviewComponent } from './features/admin/admin-review/admin-review.component';
import { AdminCauseDetailsComponent } from './features/admin/admin-cause-details/admin-cause-details.component';
import { ProfileComponent } from './features/profile/profile.component';
import { EditCauseComponent } from './features/edit-cause/edit-cause.component';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Public
  { path: 'login', component: LoginComponent }, // Public
  { path: 'register', component: RegisterComponent }, // Public
  { path: 'add-cause', component: AddCauseComponent, canActivate: [authGuard] }, // Authenticated users only
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }, // Authenticated users only
  { path: 'edit-cause/:id', component: EditCauseComponent, canActivate: [authGuard] }, // Authenticated users only
  { path: 'develop', component: DevelopComponent, canActivate: [adminGuard] }, // Admin only
  { 
    path: 'admin', 
    canActivate: [adminGuard],
    children: [
      { path: 'review', component: AdminReviewComponent },
      { path: 'causes/:id', component: AdminCauseDetailsComponent },
    ]
  },
  { path: 'cause/:id', component: CauseDetailsComponent }, // Public
  { path: 'all-causes', component: AllCausesComponent }, // Public
];
