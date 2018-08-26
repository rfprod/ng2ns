import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomServiceWorkerService } from '../services/custom-service-worker.service';
import { TranslateService } from '../translate/index';
import { UserService } from '../services/user.service';

/**
 * Application navigation component.
 */
@Component({
	selector: 'app-nav',
	templateUrl: '/public/app/views/app-nav.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppNavComponent implements OnInit, OnDestroy {

	/**
	 * @param el Element reference
	 * @param emitter Event emitter service - components interaction
	 * @param serviceWorker Custom Service Worker Service - controls service worker
	 * @param userService User service - browser local storage wrapper
	 * @param router Router - application router
	 * @param translate Translate service - UI translation to predefined languages
	 * @param window Window - window reference
	 */
	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private serviceWorker: CustomServiceWorkerService,
		private userService: UserService,
		private router: Router,
		private translate: TranslateService,
		@Inject('Window') private window: Window
	) {}

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Navigation buttons state.
	 */
	public navButtonsState: boolean[] = [false, false, false, false, false, false];

	/**
	 * Indicates if navbar should be hidden.
	 */
	public hideNavbar: boolean = false;

	/**
	 * Supported languages.
	 */
	public supportedLanguages: any[] = [
		{ key: 'en', name: 'English' },
		{ key: 'ru', name: 'Russian' }
	];

	/**
	 * Switches navigation buttons.
	 * @param event router event
	 * @param [path] path
	 */
	public switchNavButtons(event: any, path?: string): void {
		/*
		*	accepts router event, and optionally path which contains name of activated path
		*	if path parameter is passed, event parameter will be ignored
		*/
		let index: string;
		console.log('switchNavButtons:', event);
		const route: string = (event.route) ? event.route : (typeof event.urlAfterRedirects === 'string') ? event.urlAfterRedirects : event.url;
		// remove args from route if present
		path = (!path) ? route.replace(/\?.*$/, '').substring(route.lastIndexOf('/') + 1, route.length) : path;
		console.log(' >> PATH', path);
		if (path === 'intro') {
			index = '1';
			this.hideNavbar = false;
		} else if (path === 'login') {
			index = '2';
			this.hideNavbar = false;
		} else if (path === 'data') {
			index = '3';
			this.hideNavbar = false;
		} else if (path === 'map') {
			index = '4';
			this.hideNavbar = false;
		} else if (path === 'lazy') {
			index = '5';
			this.hideNavbar = false;
		} else {
			index = '0';
			this.hideNavbar = false;
		}
		// check if user was redirected to /login
		if (this.router.url === '/login') {
			index = '2';
			this.hideNavbar = false;
		}
		for (const b in this.navButtonsState) {
			if (typeof this.navButtonsState[b] === 'boolean') {
				this.navButtonsState[b] = (b === index) ? true : false;
			}
		}
		console.log('navButtonsState:', this.navButtonsState);
	}

	/**
	 * Emits websocker close event.
	 */
	public stopWS(): void {
		/*
		*	this function should be executed before user is sent to any external resource
		*	on click on an anchor object if a resource is loaded in the same tab
		*/
		console.log('close websocket event emitted');
		this.emitter.emitEvent({websocket: 'close'});
	}

	/**
	 * Logs user out.
	 */
	public logOut(): void {
		this.userService.SaveUser({ token: '' });
		this.router.navigate(['']);
	}

	/**
	 * Selects language.
	 * @param key language key
	 */
	public selectLanguage(key: string): void {
		this.emitter.emitEvent({lang: key});
	}
	/**
	 * Resolves if language is seleted.
	 * @param key language key
	 */
	public isLanguageSelected(key: string): boolean {
		return key === this.translate.currentLanguage;
	}

	/**
	 * Service worker registration state.
	 */
	public serviceWorkerRegistered: boolean = true; // registered by default
	/**
	 * Toggles service worker..
	 */
	public toggleServiceWorker(): void {
		if (this.serviceWorkerRegistered) {
			this.emitter.emitEvent({serviceWorker: 'deinitialize'});
		} else {
			this.emitter.emitEvent({serviceWorker: 'initialize'});
		}
	}

	/**
	 * Subscribes to event emitter events.
	 */
	private emitterSubscribe(): void {
		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('AppNavComponent consuming event:', event);
			if (event.serviceWorker === 'registered') {
				this.serviceWorkerRegistered = true;
			} else if (event.serviceWorker === 'unregistered') {
				this.serviceWorkerRegistered = false;
			}
		});
		this.subscriptions.push(sub);
	}

	/**
	 * Subscribes to router events.
	 */
	private routerSubscribe(): void {
		const sub: any = this.router.events.subscribe((event: any) => {
			// console.log(' > ROUTER EVENT:', event);
			if (event instanceof NavigationEnd) {
				console.log(' > ROUTER > NAVIGATION END, event', event);
				this.switchNavButtons(event);
			}
		});
		this.subscriptions.push(sub);
	}

	/**
	 * Lifecycle hook called on component initialization.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: AppNavComponent initialized');
		this.emitterSubscribe();
		this.routerSubscribe();
	}
	/**
	 * Lifecycle hook called on component destruction.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppNavComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
