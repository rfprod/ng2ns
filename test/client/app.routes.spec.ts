import { APP_ROUTES } from '../../public/app/app.routes';

import { AuthGuardGeneral } from '../../public/app/services/auth-guard-general.service';
import { AnonimousGuard } from '../../public/app/services/anonimous-guard.service';

import { AppIntroComponent } from '../../public/app/components/app-intro.component';
import { AppLoginComponent } from '../../public/app/components/app-login.component';
import { DashboardDetailsComponent } from '../../public/app/components/dashboard-details.component';
import { DashboardMapComponent } from '../../public/app/components/dashboard-map.component';

describe('APP_ROUTES', () => {

	beforeEach(() => {
		this.routes = APP_ROUTES;
	});

	it('should be defined and be an array', () => {
		expect(this.routes).toBeDefined();
		expect(this.routes).toEqual(jasmine.any(Array));
	});

	it('should have proper routes defined', () => {
		expect(this.routes).toEqual([
			{ path: 'intro', component: AppIntroComponent },
			{ path: 'login', component: AppLoginComponent, canActivate: [AnonimousGuard] },
			{ path: 'data', component: DashboardDetailsComponent, canActivate: [AuthGuardGeneral] },
			{ path: 'map', component: DashboardMapComponent, canActivate: [AuthGuardGeneral] },
			{ path: 'lazy', loadChildren: 'lazy.module#LazyModule', data: { preload: false } },
			{ path: '', redirectTo: 'intro', pathMatch: 'full' },
			{ path: '**', redirectTo: 'intro' }
		]);
	});

});
