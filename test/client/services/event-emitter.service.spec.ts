import { TestBed } from '@angular/core/testing';

import { EventEmitter } from '@angular/core';

import { EventEmitterService } from '../../../public/app/services/event-emitter.service';

describe('EventEmitterService', () => {

	beforeEach((done) => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [],
			providers: [
				{ provide: 'Window', useValue: window },
				EventEmitterService
			],
			schemas: []
		}).compileComponents().then(() => {
			this.service = TestBed.get(EventEmitterService) as EventEmitterService;
			spyOn(this.service.emitter, 'emit').and.callThrough();
			done();
		});
	});

	it('should be defined', () => {
		expect(this.service).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.service.emitter).toBeDefined();
		expect(this.service.emitter).toEqual(jasmine.any(EventEmitter));
		expect(this.service.emitEvent).toBeDefined();
		expect(this.service.getEmitter).toBeDefined();
		expect(this.service.emitSpinnerStartEvent).toEqual(jasmine.any(Function));
		expect(this.service.emitSpinnerStopEvent).toEqual(jasmine.any(Function));
	});

	it('getEmitter should return emitter', () => {
		expect(this.service.getEmitter()).toEqual(this.service.emitter);
	});

	it('emitEvent should call emitter emit method', () => {
		const msg: object = { message: 'test' };
		this.service.emitEvent(msg);
		expect(this.service.emitter.emit).toHaveBeenCalledWith(msg);
	});

	it('getEmitter should return emitter', () => {
		expect(this.service.getEmitter()).toEqual(jasmine.any(EventEmitter));
		expect(this.service.getEmitter()).toEqual(this.service.emitter);
	});

	it('emitSpinnerStartEvent should emit respective event', () => {
		this.service.emitSpinnerStartEvent();
		expect(this.service.emitter.emit).toHaveBeenCalledWith({ spinner: 'start' });
	});

	it('emitSpinnerStopEvent should emit respective event', () => {
		this.service.emitSpinnerStopEvent();
		expect(this.service.emitter.emit).toHaveBeenCalledWith({ spinner: 'stop' });
	});

});
