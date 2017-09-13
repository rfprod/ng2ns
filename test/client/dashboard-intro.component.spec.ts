'use strict';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Http, BaseRequestOptions, Response, ResponseOptions, Headers } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { NvD3Component } from 'ng2-nvd3';
import { EventEmitterService } from '../../public/app/services/event-emitter.service';

import { TranslateService, TranslatePipe, TRANSLATIONS } from '../../public/app/translate/index';

import { ServerStaticDataService } from '../../public/app/services/server-static-data.service';
import { PublicDataService } from '../../public/app/services/public-data.service';
import { Observable } from 'rxjs/Rx';

import { FlexLayoutModule } from '@angular/flex-layout';
import '../../node_modules/hammerjs/hammer.js';
import { MaterialModule } from '@angular/material';

import { DashboardIntroComponent } from '../../public/app/components/dashboard-intro.component';

describe('DashboardIntroComponent', () => {

	class MockTranslateService extends TranslateService {
		constructor() {
			super(TRANSLATIONS);
		}
		private _curLang: string;
		public get currentLanguage(): string {
			return this._curLang;
		}
		public use(key: string): void {
			this._curLang = key;
		}
	}

	class MockServerStaticDataService extends ServerStaticDataService {
		constructor() {
			super(null);
		}
		getServerStaticData() {
			console.log('getServerStaticData: return test data');
			return Observable.of([
				{
					name: 'dyn name 1',
					value: 'dyn value 1'
				},{
					name: 'dyn name 2',
					value: 'dyn value 2'
				},{
					name: 'dyn name 3',
					value: 'dyn value 3'
				},{
					name: 'dyn name 4',
					value: 'dyn value 4'
				}
			]);
		};
	}

	class MockPublicDataService extends PublicDataService {
		constructor() {
			super(null);
		}
		getPublicData() {
			console.log('getPublicData: return test data');
			return Observable.of([
				{
					name: 'dyn name 1',
					value: 'dyn value 1'
				},{
					name: 'dyn name 2',
					value: 'dyn value 2'
				}
			]);
		};
	}

	beforeEach((done) => {
		TestBed.configureTestingModule({
			declarations: [ TranslatePipe, NvD3Component, DashboardIntroComponent, NvD3Component ],
			imports: [ NoopAnimationsModule, MaterialModule, FlexLayoutModule ],
			providers: [
				EventEmitterService,
				{ provide: TranslateService, useClass: MockTranslateService },
				BaseRequestOptions,
				MockBackend,
				{ provide: Http,
					useFactory: (mockedBackend, requestOptions) => new Http(mockedBackend, requestOptions),
					deps: [MockBackend, BaseRequestOptions]
				},
				{
					provide: PublicDataService,
					useFactory: (http) => new PublicDataService(http),
					deps: [Http]
				},
				{
					provide: ServerStaticDataService,
					useFactory: (http) => new ServerStaticDataService(http),
					deps: [Http]
				},
				{ provide: Window, useValue: { location: { host: 'localhost', protocol: 'http' } } }
			],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
		}).compileComponents().then(() => {
			this.fixture = TestBed.createComponent(DashboardIntroComponent);
			this.component = this.fixture.componentInstance;
			spyOn(this.component, 'emitSpinnerStartEvent').and.callThrough();
			spyOn(this.component, 'emitSpinnerStopEvent').and.callThrough();
			this.eventEmitterSrv = TestBed.get(EventEmitterService) as EventEmitterService;
			spyOn(this.eventEmitterSrv, 'emitEvent').and.callThrough();
			this.serverStaticDataSrv = TestBed.get(ServerStaticDataService) as ServerStaticDataService;
			this.publicDataSrv = TestBed.get(PublicDataService) as PublicDataService;
			this.translateService = TestBed.get(TranslateService) as TranslateService;
			this.backend = TestBed.get(MockBackend) as MockBackend;
			done();
		});
	});

	it('should be defined', () => {
		console.log(this.component);
		expect(this.component).toBeDefined();
	});

	it('should have variables defined', () => {
		expect(this.component.title).toBeDefined();
		expect(this.component.title === 'Ng2NodeStarter (Ng2NS)').toBeTruthy();
		expect(this.component.description).toBeDefined();
		expect(this.component.description === 'Angular, NodeJS').toBeTruthy();
		expect(this.component.host).toBeDefined();
		expect(this.component.host).toEqual(window.location.host);
		expect(this.component.wsUrl).toEqual('ws://'+this.component.host+'/api/app-diag/dynamic');
		expect(this.component.chartOptions).toEqual(jasmine.any(Object));
		expect(this.component.chartOptions.chart).toBeDefined();
		expect(this.component.chartOptions.chart).toEqual({
			type: jasmine.any(String),
			height: jasmine.any(Number),
			donut: jasmine.any(Boolean),
			x: jasmine.any(Function),
			y: jasmine.any(Function),
			showLabels: jasmine.any(Boolean),
			labelSunbeamLayout: jasmine.any(Boolean),
			pie: {
				startAngle: jasmine.any(Function),
				endAngle: jasmine.any(Function)
			},
			duration: jasmine.any(Number),
			title: jasmine.any(String),
			legend: {
				margin: {
					top: jasmine.any(Number),
					right: jasmine.any(Number),
					bottom: jasmine.any(Number),
					left: jasmine.any(Number)
				}
			}
		});
		expect(this.component.appUsageData).toEqual(jasmine.any(Array));
		expect(this.component.serverData).toEqual({
			static: jasmine.any(Array),
			dynamic: jasmine.any(Array)
		});
		expect(this.component.ws).toBeDefined();
		expect(this.component.getServerStaticData).toBeDefined();
		expect(this.component.getPublicData).toBeDefined();
		expect(this.component.emitSpinnerStartEvent).toBeDefined();
		expect(this.component.emitSpinnerStopEvent).toBeDefined();
		expect(this.component.nvd3).toEqual(jasmine.any(NvD3Component));
		expect(this.component.ngOnInit).toBeDefined();
		expect(this.component.ngOnDestroy).toBeDefined();
	});

	it('emitSpinnerStartEvent should send respective event emitter message', () => {
		this.component.emitSpinnerStartEvent();
		expect(this.eventEmitterSrv.emitEvent).toHaveBeenCalledWith({ spinner: 'start' });
	});

	it('emitSpinnerStopEvent should send respective event emitter message', () => {
		this.component.emitSpinnerStopEvent();
		expect(this.eventEmitterSrv.emitEvent).toHaveBeenCalledWith({ spinner: 'stop' });
	});

});

