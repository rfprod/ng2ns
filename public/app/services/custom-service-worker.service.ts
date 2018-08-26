import { Injectable, Inject } from '@angular/core';
import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';

/**
 * Custom service worker service.
 */
@Injectable()
export class CustomServiceWorkerService {

	/**
	 * @param emitter Event Emitter SErvice
	 * @param window Window - window reference
	 */
	constructor(
		private emitter: EventEmitterService,
		@Inject('Window') private window: Window
	) {
		console.log('CustomServiceWorkerService init');
		this.initializeServiceWorker();
	}

	/**
	 * Service worker instance.
	 */
	private serviceWorker: any = this.window.navigator.serviceWorker;

	/**
	 * Service worker registration,
	 */
	private serviceWorkerRegistration: any;

	/**
	 * Registers service worker.
	 */
	private registerServiceWorker(): Promise<boolean> {
		const def = new CustomDeferredService<boolean>();
		if (this.serviceWorker) {
			console.log('serviceWorker exists in navigator, registering');
			this.serviceWorker.register('/service-worker.js', {
				scope: '/'
			}).then((registration: any) => {
				console.log('serviceWorker registration completed, registration:', registration);
				this.serviceWorkerRegistration = registration;
				def.resolve();
			});
		} else {
			console.log('serviceWorker does not exist in navigator');
			def.reject();
		}
		return def.promise;
	}

	/**
	 * Unregisters service worker.
	 */
	private unregisterServiceWorker(): Promise<boolean> {
		const def = new CustomDeferredService<boolean>();
		if (this.serviceWorker) {
			this.serviceWorker.getRegistrations().then((registrations: any) => {
				console.log('removing registrations', registrations);
				return Promise.all(registrations.map((item: any) => item.unregister())).then(() => {
					console.log('serviceWorker unregistered');
					def.resolve();
				});
			});
			this.serviceWorkerRegistration = undefined;
		} else {
			console.log('serviceWorker does not exist in navigator');
			def.resolve();
		}
		return def.promise;
	}

	/**
	 * Event emitter subscription.
	 */
	private emitterSubscription: any;

	/**
	 * Subscribe to Event emitter events.
	 */
	private emitterSubscribe(): void {
		this.emitterSubscription = this.emitter.getEmitter().subscribe((message: any) => {
			console.log('CustomServiceWorkerService consuming event:', JSON.stringify(message));
			if (message.serviceWorker === 'initialize') {
				this.initializeServiceWorker();
			} else if (message.serviceWorker === 'deinitialize') {
				this.deinitializeServiceWorker();
			}
		});
	}

	/**
	 * Unsubscribe from event emitter events.
	 */
	private emitterUnsubscribe(): void {
		this.emitterSubscription.unsubscribe();
	}

	/**
	 * Initializes service worker.
	 */
	public initializeServiceWorker(): void {
		this.registerServiceWorker().then(() => {
			this.emitterSubscribe();
			this.emitter.emitEvent({serviceWorker: 'registered'});
		}).catch(() => {
			this.emitter.emitEvent({serviceWorker: 'unregistered'});
		});
	}

	/**
	 * Deinitializes service worker.
	 */
	private deinitializeServiceWorker(): void {
		this.unregisterServiceWorker().then(() => {
			this.emitter.emitEvent({serviceWorker: 'unregistered'});
		});
	}

	/**
	 * Disables service worker.
	 * Unregisters and unsubscribes from Event emitter events.
	 */
	public disableServiceWorker(): void {
		this.unregisterServiceWorker().then(() => {
			this.emitterUnsubscribe();
			this.emitter.emitEvent({serviceWorker: 'unregistered'});
		});
	}

	/**
	 * Resolves if service worker is registered.
	 */
	public isServiceWorkerRegistered(): boolean {
		return this.serviceWorker && typeof this.serviceWorkerRegistration !== 'undefined';
	}
}
