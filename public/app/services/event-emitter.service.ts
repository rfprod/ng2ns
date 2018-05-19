import { Injectable, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class EventEmitterService {

	/**
	 * Event emitter instance.
	 */
	private emitter: EventEmitter<any> = new EventEmitter();

	/**
	 * Returns event emitter instance.
	 */
	public getEmitter(): EventEmitter<any>  {
		return this.emitter;
	}

	/**
	 * Emits erbitrary event.
	 */
	public emitEvent(object: object): void {
		this.emitter.emit(object);
	}

	/**
	 * Emits spinner start event.
	 */
	public emitSpinnerStartEvent(): void {
		console.log('root spinner start event emitted');
		this.emitter.emit({sys: 'start spinner'});
	}

	/**
	 * Emits spinner stop event.
	 */
	public emitSpinnerStopEvent(): void {
		console.log('root spinner stop event emitted');
		this.emitter.emit({sys: 'stop spinner'});
	}

}
