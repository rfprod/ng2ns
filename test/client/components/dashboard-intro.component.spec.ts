import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Http, BaseRequestOptions, Response, ResponseOptions, Headers } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { NvD3Component } from 'ng2-nvd3';

import { EventEmitterService } from '../../../public/app/services/event-emitter.service';

import { TranslateService, TranslateModule } from '../../../public/app/translate/index';

import { CustomHttpHandlersService } from '../../../public/app/services/custom-http-handlers.service';

import { ServerStaticDataService } from '../../../public/app/services/server-static-data.service';
import { PublicDataService } from '../../../public/app/services/public-data.service';
import { WebsocketService } from '../../../public/app/services/websocket.service';

import { Observable, Subject } from 'rxjs';

import { FlexLayoutModule } from '@angular/flex-layout';
import '../../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from '../../../public/app/modules/custom-material.module';

import { DashboardIntroComponent } from '../../../public/app/components/dashboard-intro.component';

describe('DashboardIntroComponent', () => {

	beforeEach((done) => {
		TestBed.configureTestingModule({
			declarations: [ NvD3Component, DashboardIntroComponent, NvD3Component ],
			imports: [ BrowserDynamicTestingModule, NoopAnimationsModule, CustomMaterialModule, FlexLayoutModule, TranslateModule.forRoot() ],
			providers: [
				{ provide: 'Window', useValue: { location: { host: 'localhost', protocol: 'http' } } },
				EventEmitterService,
				BaseRequestOptions,
				MockBackend,
				{ provide: Http,
					useFactory: (mockedBackend, requestOptions) => new Http(mockedBackend, requestOptions),
					deps: [MockBackend, BaseRequestOptions]
				},
				CustomHttpHandlersService,
				{
					provide: PublicDataService,
					useFactory: (http, window, handlers) => new PublicDataService(http, window, handlers),
					deps: [Http, 'Window', CustomHttpHandlersService]
				},
				{
					provide: ServerStaticDataService,
					useFactory: (http, window, handlers) => new ServerStaticDataService(http, window, handlers),
					deps: [Http, 'Window', CustomHttpHandlersService]
				},
				{
					provide: WebsocketService,
					useFactory: (window) => new WebsocketService(window),
					deps: ['Window']
				}
			],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
		}).compileComponents().then(() => {
			this.fixture = TestBed.createComponent(DashboardIntroComponent);
			this.component = this.fixture.componentInstance;
			this.eventEmitterSrv = TestBed.get(EventEmitterService) as EventEmitterService;
			spyOn(this.eventEmitterSrv, 'emitEvent').and.callThrough();
			this.serverStaticDataSrv = TestBed.get(ServerStaticDataService) as ServerStaticDataService;
			this.publicDataSrv = TestBed.get(PublicDataService) as PublicDataService;
			this.translateService = TestBed.get(TranslateService) as TranslateService;
			this.backend = TestBed.get(MockBackend) as MockBackend;
			done();
		});
	});

	afterEach(() => this.backend.verifyNoPendingRequests());

	it('should be defined', () => {
		expect(this.component).toBeDefined();
	});

	it('should have variables defined', () => {
		expect(this.component.subscriptions).toEqual(jasmine.any(Array));
		expect(this.component.title).toBeDefined();
		expect(this.component.title === 'Ng2NodeStarter (Ng2NS)').toBeTruthy();
		expect(this.component.description).toBeDefined();
		expect(this.component.description === 'Angular, NodeJS').toBeTruthy();
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
		expect(this.component.wsEndpoint).toBeDefined();
		expect(this.component.wsEndpoint).toEqual('/api/app-diag/dynamic');
		expect(this.component.ws).toEqual(jasmine.any(WebSocket));
		expect(this.component.getServerStaticData).toBeDefined();
		expect(this.component.getPublicData).toBeDefined();
		expect(this.component.nvd3).toEqual(jasmine.any(NvD3Component));
		expect(this.component.ngOnInit).toBeDefined();
		expect(this.component.ngOnDestroy).toBeDefined();
	});

	it('should be properly destroyed', () => {
		this.component.ngOnInit();
		for (const sub of this.component.subscriptions) {
			spyOn(sub, 'unsubscribe').and.callThrough();
		}
		this.component.ngOnDestroy();
		for (const sub of this.component.subscriptions) {
			expect(sub.unsubscribe).toHaveBeenCalled();
		}
	});

});
