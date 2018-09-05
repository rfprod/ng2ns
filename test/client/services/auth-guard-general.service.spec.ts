import { TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot } from '@angular/router';

import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { UserService } from '../../../public/app/services/user.service';

import { AuthGuardGeneral } from '../../../public/app/services/auth-guard-general.service';

import { DummyComponent } from '../mocks/index';

describe('AuthGuardGeneral', () => {

	class LocalStorageMock {

		public getItem(key: string): any {
			return (this[key]) ? this[key] : undefined;
		}

		public setItem(key: string, value: string): void {
			this[key] = value;
		}

		public removeItem(key: string): void {
			this[key] = undefined;
		}
	}

	Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock(), writable: true});

	beforeEach((done: DoneFn) => {
		TestBed.configureTestingModule({
			declarations: [ DummyComponent ],
			imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([
				{path: 'login', component: DummyComponent},
				{path: 'profile', component: DummyComponent, canActivate: [AuthGuardGeneral]},
				{path: 'carrier', component: DummyComponent, canActivate: [AuthGuardGeneral]},
				{path: 'owner', component: DummyComponent, canActivate: [AuthGuardGeneral]}
			]) ],
			providers: [
				{ provide: 'Window', useValue: window },
				UserService,
				{
					provide: AuthGuardGeneral,
					useFactory: (userService, router) => new AuthGuardGeneral(userService, router),
					deps: [UserService, Router]
				}
			]
		}).compileComponents().then(() => {
			this.fixture = TestBed.createComponent(DummyComponent);
			this.component = this.fixture.componentInstance;
			this.userService = TestBed.get(UserService) as UserService;
			this.service = TestBed.get(AuthGuardGeneral) as AuthGuardGeneral;
			this.httpController = TestBed.get(HttpTestingController) as HttpTestingController;
			done();
		});
	});

	afterEach(() => this.httpController.verify());

	it('should be defined', () => {
		expect(this.service).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.service.canActivate).toEqual(jasmine.any(Function));
	});

	it('canActivate should resolve to false if token does not exist in UserService', () => {

		this.userService.SaveUser({ token: '' });

		const route = { url: [ { path: 'any' } ]} as ActivatedRouteSnapshot;
		const can = this.service.canActivate(route)
		expect(can).toBeFalsy();

	});

	it('canActivate should resolve to true if tones exists in UserService', () => {

		this.userService.SaveUser({ token: 'a.a' });

		const route = { url: [ { path: 'any' } ]} as ActivatedRouteSnapshot;
		const can = this.service.canActivate(route)
		expect(can).toBeTruthy();

	});

});
