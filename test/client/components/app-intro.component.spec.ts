import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { EventEmitterService } from '../../../public/app/services/event-emitter.service';

import { TranslateService, TranslateModule } from '../../../public/app/modules/translate/index';

import { CustomHttpHandlersService } from '../../../public/app/services/custom-http-handlers.service';

import { ServerStaticDataService } from '../../../public/app/services/server-static-data.service';
import { PublicDataService } from '../../../public/app/services/public-data.service';
import { WebsocketService } from '../../../public/app/services/websocket.service';

import { FlexLayoutModule } from '@angular/flex-layout';
import '../../../node_modules/hammerjs/hammer.js';
import { CustomMaterialModule } from '../../../public/app/modules/custom-material.module';

import { AppIntroComponent } from '../../../public/app/components/app-intro.component';

describe('AppIntroComponent', () => {

	class WebSocketMock {
		constructor(url: string) {
			console.log('WebSocketMock, url', url);
		}
		public send() { return true; }
		public open() { return true; }
		public close() { return true; }
		public message() { return true; }
		public onclose() { return true; }
		public onerror() { return true; }
		public onmessage() { return true; }
		public onopen() { return true; }
	}
	// override websocket
	const wsKey = 'WebSocket';
	window[wsKey] = (url) => new WebSocketMock(url);

	beforeEach((done) => {
		TestBed.configureTestingModule({
			declarations: [ AppIntroComponent ],
			imports: [
				BrowserDynamicTestingModule, NoopAnimationsModule, HttpClientTestingModule, CustomMaterialModule,
				FlexLayoutModule, TranslateModule
			],
			providers: [
				{ provide: 'Window', useValue: window },
				EventEmitterService,
				CustomHttpHandlersService,
				{
					provide: PublicDataService,
					useFactory: (http, handlers, window) => new PublicDataService(http, handlers, window),
					deps: [HttpClient, CustomHttpHandlersService, 'Window']
				},
				{
					provide: ServerStaticDataService,
					useFactory: (http, handlers, window) => new ServerStaticDataService(http, handlers, window),
					deps: [HttpClient, CustomHttpHandlersService, 'Window']
				},
				{
					provide: WebsocketService,
					useFactory: (window) => new WebsocketService(window),
					deps: ['Window']
				}
			],
			schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
		}).compileComponents().then(() => {
			this.fixture = TestBed.createComponent(AppIntroComponent);
			this.component = this.fixture.componentInstance;
			this.eventEmitterSrv = TestBed.get(EventEmitterService) as EventEmitterService;
			spyOn(this.eventEmitterSrv, 'emitEvent').and.callThrough();
			this.serverStaticDataSrv = TestBed.get(ServerStaticDataService) as ServerStaticDataService;
			this.publicDataSrv = TestBed.get(PublicDataService) as PublicDataService;
			this.translateService = TestBed.get(TranslateService) as TranslateService;
			this.httpController = TestBed.get(HttpTestingController) as HttpTestingController;
			done();
		});
	});

	afterEach(() => {
		this.httpController.match((req: HttpRequest<any>): boolean => true).forEach((req: TestRequest) => req.flush([]));
		this.httpController.verify();
	});

	it('should be defined', () => {
		expect(this.component).toBeDefined();
	});

	it('should have variables defined', () => {
		expect(this.component.subscriptions).toEqual(jasmine.any(Array));
		expect(this.component.title).toBeDefined();
		expect(this.component.title === 'Ng2NodeStarter (Ng2NS)').toBeTruthy();
		expect(this.component.description).toBeDefined();
		expect(this.component.description === 'Angular, NodeJS').toBeTruthy();
		expect(this.component.canvas).toBeDefined();
		expect(this.component.appUsageData).toEqual(jasmine.any(Array));
		expect(this.component.drawChart).toEqual(jasmine.any(Function));
		expect(this.component.serverData).toEqual({
			static: jasmine.any(Array),
			dynamic: jasmine.any(Array)
		});
		expect(this.component.wsEndpoint).toBeDefined();
		expect(this.component.wsEndpoint).toEqual('/api/app-diag/dynamic');
		expect(this.component.ws).toEqual(jasmine.any(WebSocketMock));
		expect(this.component.getServerStaticData).toBeDefined();
		expect(this.component.getPublicData).toBeDefined();
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
