import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { CustomHttpHandlersService } from '../../../public/app/services/custom-http-handlers.service';

import { PublicDataService } from '../../../public/app/services/public-data.service';

describe('PublicDataService', () => {

	beforeEach((done: DoneFn) => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [ HttpClientTestingModule ],
			providers: [
				{ provide: 'Window', useValue: window },
				{
					provide: CustomHttpHandlersService,
					useFactory: () => new CustomHttpHandlersService()
				},
				{
					provide: PublicDataService,
					useFactory: (http, handlers, win) => new PublicDataService(http, handlers, win),
					deps: [HttpClient, CustomHttpHandlersService, 'Window']
				}
			]
		}).compileComponents().then(() => {
			this.httpController = TestBed.get(HttpTestingController) as HttpTestingController;
			this.service = TestBed.get(PublicDataService) as PublicDataService;
			this.window = TestBed.get('Window') as Window;
			done();
		});
	});

	afterEach(() => {
		this.httpController.match((req: HttpRequest<any>): boolean => true).forEach((req: TestRequest) => req.flush({}));
		this.httpController.verify();
	});

	it('should be defined', () => {
		expect(this.service).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.service.endpoint).toEqual(jasmine.any(String));
		expect(this.service.getData).toBeDefined();
	});

	it('getData should return server stats as an array of objects', (done: DoneFn) => {
		const sampleData = [{key: 'stat 1', y: 1}, {key: 'stat 2', y: 2}];
		this.service.getData().subscribe(
			(data) => {
				expect(data).toEqual(sampleData);
				done();
			},
			(error) => console.log('should not be triggered')
		);
		this.httpController.expectOne(this.window.location.origin + '/api/app-diag/usage').flush(sampleData);
	});

});
