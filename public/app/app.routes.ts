import { Routes } from '@angular/router';
import { AuthGuardGeneral } from './services/auth-guard-general.service';
import { DashboardIntroComponent } from './components/dashboard-intro.component';
import { DashboardLoginComponent } from './components/dashboard-login.component';
import { DashboardDetailsComponent } from './components/dashboard-details.component';

export const APP_ROUTES: Routes = [
	{path: 'intro', component: DashboardIntroComponent},
	{path: 'login', component: DashboardLoginComponent},
	{path: 'data', component: DashboardDetailsComponent, canActivate: [AuthGuardGeneral]},
	{path: '', redirectTo: 'intro', pathMatch: 'full'},
	{path: '**', redirectTo: 'intro'}
];
