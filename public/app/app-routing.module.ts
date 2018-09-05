import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardGeneral } from './services/auth-guard-general.service';
import { AnonimousGuard } from './services/anonimous-guard.service';

import { AppIntroComponent } from './components/app-intro.component';
import { AppLoginComponent } from './components/app-login.component';
import { DashboardDetailsComponent } from './components/dashboard-details.component';
import { DashboardMapComponent } from './components/dashboard-map.component';

import { CustomPreloadingStrategy } from './custom-preloading.strategy';

/**
 * Application routes.
 */
export const APP_ROUTES: Routes = [
	{ path: 'intro', component: AppIntroComponent },
	{ path: 'login', component: AppLoginComponent, canActivate: [AnonimousGuard] },
	{ path: 'data', component: DashboardDetailsComponent, canActivate: [AuthGuardGeneral] },
	{ path: 'map', component: DashboardMapComponent, canActivate: [AuthGuardGeneral] },
	{ path: 'lazy', loadChildren: 'lazy.module#LazyModule', data: { preload: false } },
	{ path: '', redirectTo: 'intro', pathMatch: 'full' },
	{ path: '**', redirectTo: 'intro' },
];

/**
 * Application routing module.
 */
@NgModule({
	imports: [ RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: CustomPreloadingStrategy }) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}

/**
 * Application routing module with providers.
 */
export const AppRoutingModuleWithProviders: ModuleWithProviders = {
	ngModule: AppRoutingModule,
	providers: [ CustomPreloadingStrategy ]
};
