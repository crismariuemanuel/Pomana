import { Routes } from '@angular/router';

import { AddCauseComponent } from './features/add-cause/add-cause.component';
import { CauseDetailsComponent } from './features/cause-details/cause-details.component';
import { HomeComponent } from './features/home/home.component';
import { AllCausesComponent } from './features/all-causes/all-causes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-cause', component: AddCauseComponent },
  { path: 'cause/:id', component: CauseDetailsComponent },
  { path: 'all-causes', component: AllCausesComponent }
];
