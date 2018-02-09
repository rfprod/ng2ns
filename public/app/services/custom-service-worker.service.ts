import { Injectable, Inject } from '@angular/core';
import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Injectable()
export class CustomServiceWorkerService {
	constructor(
		private emitter: EventEmitterService,
		@Inject('Window') private window: Window
	) {
		console.log('CustomServiceWorkerService init');
		this.initializeServiceWorker();
	}

	private ngUnsubscribe: Subject<void> = new Subject();

	private serviceWorker: any = this.window.navigator.serviceWorker;

	private registerServiceWorker(): Promise<boolean> {
		const def = new CustomDeferredService<boolean>();
		if (this.serviceWorker) {
			console.log('serviceWorker exists in navigator, registering');
			this.serviceWorker.register('/service-worker.js', {
				scope: '/'
			}).then((registration: any) => {
				console.log('serviceWorker registration completed, registration:', registration);
				def.resolve();
			});
		} else {
			console.log('serviceWorker does not exist in navigator');
			def.resolve();
		}
		return def.promise;
	}

	private unregisterServiceWorker(): void {
		this.serviceWorker.getRegistrations().then((registrations: any) => {
			console.log('removing registrations', registrations);
			return Promise.all(registrations.map((item: any) => item.unregister()));
		});
	}

	public emitterSubscribe(): void {
		this.emitter.getEmitter().takeUntil(this.ngUnsubscribe).subscribe((message: any) => {
			console.log('CustomServiceWorkerService consuming event:', JSON.stringify(message));
			if (message.serviceWorker === true) {
				this.registerServiceWorker();
			} else if (message.serviceWorker === false) {
				this.unregisterServiceWorker();
			}
		});
	}

	public emitterUnsubscribe(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public initializeServiceWorker(): void {
		this.emitterSubscribe();
		this.registerServiceWorker();
	}

	public deinitializeServiceWorker(): void {
		this.emitterUnsubscribe();
		this.unregisterServiceWorker();
	}
}
