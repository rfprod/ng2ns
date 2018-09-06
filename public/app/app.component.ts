import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Router, RouteConfigLoadStart } from '@angular/router';
import { EventEmitterService } from './services/event-emitter.service';
import { TranslateService } from './modules/translate/index';
import { CustomServiceWorkerService } from './services/custom-service-worker.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MatIconRegistry, DateAdapter } from '@angular/material';

/**
 * Application root component.
 */
@Component({
	selector: 'root',
	template: `
		<app-nav></app-nav>
		<router-outlet></router-outlet>
		<app-info [hidden]="!showAppInfo"></app-info>
		<span id="spinner" *ngIf="showSpinner">
			<mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
		</span>
	`,
	animations: [
		trigger('empty', [])
	]
})
export class AppComponent implements OnInit, OnDestroy {

	/**
	 * @param el Element reference
	 * @param emitter Event emitter service - components interaction
	 * @param translate Translate service - UI translation to predefined languages
	 * @param router Router - application router
	 * @param matIconRegistry Material icon registry - icons registry for registering icons for usage within mat-icon selector
	 * @param dateAdapter Date adapter - used by datepickers
	 * @param serviceWorker Custom Service Worker Service - controls service worker
	 * @param window Window - window reference
	 */
	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private translate: TranslateService,
		private router: Router,
		private matIconRegistry: MatIconRegistry,
		private dateAdapter: DateAdapter<any>,
		private serviceWorker: CustomServiceWorkerService,
		@Inject('Window') private window: Window
	) {
		console.log('this.el.nativeElement', this.el.nativeElement);
	}

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	public showAppInfo: boolean = true;

	public showSpinner: boolean = false;

	/**
	 * Shows spinner.
	 */
	private startSpinner(): void {
		console.log('spinner start');
		this.showSpinner = true;
	}
	/**
	 * Hides spinner.
	 */
	private stopSpinner(): void {
		console.log('spinner stop');
		this.showSpinner = false;
	}

	/**
	 * Supported languages.
	 */
	private supportedLanguages: any[] = [
		{ key: 'en', name: 'English' },
		{ key: 'ru', name: 'Russian' }
	];

	/**
	 * Resolves if language is current by key.
	 */
	private isCurrentLanguage(key: string): boolean {
		// check if selected one is a current language
		return key === this.translate.currentLanguage;
	}
	/**
	 * Selects language.
	 * @param key language key
	 */
	private selectLanguage(key: string): void {
		if (!this.isCurrentLanguage(key)) {
			// set current language
			this.translate.use(key);
			// set datepickers locale
			this.setDatepickersLocale(key);
		}
	}
	/**
	 * Sets datepicker locale.
	 * @param key langyage key
	 */
	private setDatepickersLocale(key: string): void {
		/*
		*	set datepickers locale
		*	supported languages: en, ru
		*/
		console.log('language change, key', key, 'this.dateAdapter', this.dateAdapter);
		if (key === 'ru') {
			this.dateAdapter.setLocale('ru');
		} else {
			this.dateAdapter.setLocale('en');
		}
	}

	/**
	 * Removes UI initialization object, kind of splashscreen.
	 */
	private removeUIinit(): void {
		const initUIobj: HTMLElement = this.window.document.getElementById('init');
		console.log('initUIobj', initUIobj);
		if (initUIobj) {
			initUIobj.parentNode.removeChild(initUIobj);
		}
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppComponent initialized');

		this.removeUIinit();

		let sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			if (event.appInfo) {
				if (event.appInfo === 'hide') {
					this.showAppInfo = false;
				} else if (event.appInfo === 'show') {
					this.showAppInfo = true;
				}
			}
			if (event.spinner) {
				if (event.spinner === 'start') {
					console.log('starting spinner');
					this.startSpinner();
				} else if (event.spinner === 'stop') {
					console.log('stopping spinner');
					this.stopSpinner();
				}
			}
			if (event.lang) {
				console.log('switch language', event.lang);
				if (this.supportedLanguages.filter((item: any) => item.key === event.lang).length) {
					// switch language only if it is present in supportedLanguages array
					this.selectLanguage(event.lang);
				} else {
					console.log('selected language is not supported');
				}
			}
		});
		this.subscriptions.push(sub);

		sub = this.dateAdapter.localeChanges.subscribe(() => {
			console.log('dateAdapter.localeChanges, changed according to the language');
		});
		this.subscriptions.push(sub);

		/*
		* check preferred language, respect preference if dictionary exists
		*	for now there are only dictionaries only: English, Russian
		*	set Russian if it is preferred, else use English
		*/
		const nav: any = this.window.navigator;
		const userPreference: string = (nav.language === 'ru-RU' || nav.language === 'ru' || nav.languages[0] === 'ru') ? 'ru' : 'en';

		this.selectLanguage(userPreference); // set default language

		/*
		*	register fontawesome for usage in mat-icon by adding directives
		*	fontSet="fab" fontIcon="fa-icon"
		*	fontSet="fas" fontIcon="fa-icon"
		*
		*	note: free plan includes only fab (font-awesome-brands) and fas (font-awesome-solid) groups
		*
		*	icons reference: https://fontawesome.com/icons/
		*/
		this.matIconRegistry.registerFontClassAlias('fontawesome-all');

		sub = this.router.events.subscribe((event: any) => {
			console.log(' > AppComponent, ROUTER EVENT:', event);
			if (event instanceof RouteConfigLoadStart) {
				console.log('RouteConfigLoadStart, event', event);
			}
		});
		this.subscriptions.push(sub);
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppComponent destroyed');
		this.emitter.emitEvent({serviceWorker: 'deinitialize'});
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}

}
