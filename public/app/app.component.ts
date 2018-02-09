import { Component, OnInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from './services/event-emitter.service';
import { TranslateService } from './translate/index';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MatIconRegistry, DateAdapter } from '@angular/material';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/first';

declare let $: JQueryStatic;

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

	constructor(
		public el: ElementRef,
		private emitter: EventEmitterService,
		private translate: TranslateService,
		private router: Router,
		private matIconRegistry: MatIconRegistry,
		private dateAdapter: DateAdapter<any>,
		@Inject('Window') private window: Window
	) {
		console.log('this.el.nativeElement', this.el.nativeElement);
	}

	private ngUnsubscribe: Subject<void> = new Subject();

	public showAppInfo: boolean = true;
	public showSpinner: boolean = false;

	// spinner controls
	public startSpinner(): void {
		console.log('spinner start');
		this.showSpinner = true;
	}
	public stopSpinner(): void {
		console.log('spinner stop');
		this.showSpinner = false;
	}

	public supportedLanguages: any[] = [
		{ key: 'en', name: 'English' },
		{ key: 'ru', name: 'Russian' }
	];

	public isCurrentLanguage(key: string): boolean {
		// check if selected one is a current language
		return key === this.translate.currentLanguage;
	}
	public selectLanguage(key: string): void {
		if (!this.isCurrentLanguage(key)) {
			// set current language
			this.translate.use(key);
			// set datepickers locale
			this.setDatepickersLocale(key);
		}
	}
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

	public ngOnInit(): void {
		console.log('ngOnInit: AppComponent initialized');

		$('#init').remove(); // remove initialization text

		// listen event emitter control messages
		this.emitter.getEmitter().takeUntil(this.ngUnsubscribe).subscribe((message: any) => {
			console.log('app consuming event:', message);
			if (message.appInfo) {
				if (message.appInfo === 'hide') {
					this.showAppInfo = false;
				} else if (message.appInfo === 'show') {
					this.showAppInfo = true;
				}
			}
			if (message.spinner) {
				if (message.spinner === 'start') { // spinner control message
					console.log('starting spinner');
					this.startSpinner();
				} else if (message.spinner === 'stop') { // spinner control message
					console.log('stopping spinner');
					this.stopSpinner();
				}
			}
			if (message.lang) { // switch translation message
				console.log('switch language', message.lang);
				if (this.supportedLanguages.filter((item: any) => item.key === message.lang).length) {
					// switch language only if it is present in supportedLanguages array
					this.selectLanguage(message.lang);
				} else {
					console.log('selected language is not supported');
				}
			}
		});

		// listen date adapter locale change
		this.dateAdapter.localeChanges.takeUntil(this.ngUnsubscribe).subscribe(() => {
			console.log('dateAdapter.localeChanges, changed according to the language');
		});

		/*
		* check preferred language, respect preference if dictionary exists
		*	for now there are only dictionaries only: English, Russian
		*	set Russian if it is preferred, else use English
		*/
		const nav: any = this.window.navigator;
		const userPreference: string = (nav.language === 'ru-RU' || nav.language === 'ru' || nav.languages[0] === 'ru') ? 'ru' : 'en';
		// set default language
		this.selectLanguage(userPreference);

		/*
		*	register fontawesome for usage in mat-icon by adding directives
		*	fontSet="fa" fontIcon="fa-icon"
		*/
		this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');

		/*
		*	TODO:app.component router events
		*
		this.router.events.takeUntil(this.ngUnsubscribe).subscribe((event: any) => {
			console.log(' > AppComponent listens ROUTER EVENT:', event);
		});
		*/

	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppComponent destroyed');
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

}
