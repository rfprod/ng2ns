import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from '../services/event-emitter.service';

@Component({
	selector: 'app-nav',
	templateUrl: '/public/app/views/dashboard-nav.html',
})
export class AppNavComponent implements OnInit, OnDestroy {

	constructor(
		private emitter: EventEmitterService,
		private router: Router
	) {}

	private subscription: any;
	public navButtonsState: boolean[] = [false, false, false, false];

	public supportedLanguages: any[];

	public switchNavButtons(event, path) {
		let index;
		console.log('switchNavButtons:', event);
		const route = (event.route) ? event.route : (typeof event.urlAfterRedirects === 'string') ? event.urlAfterRedirects : event.url;
		path = (!path) ? route.substring(route.lastIndexOf('/') + 1, route.length) : path;
		console.log(' >> PATH', path);
		if (path === 'intro') {
			index = '1';
		} else if (path === 'login') {
			index = '2';
		} else if (path === 'data') {
			index = '3';
		} else {
			index = '0';
		}
		for (const b in this.navButtonsState) {
			if (b === index) { this.navButtonsState[b] = true; } else { this.navButtonsState[b] = false; }
		}
		console.log('navButtonsState:', this.navButtonsState);
	}

	public stopWS() {
		/*
		*	this function should be executed before user is sent to any external resource
		*	on click on an anchor object if a resource is loaded in the same tab
		*/
		console.log('close websocket event emitted');
		this.emitter.emitEvent({sys: 'close websocket'});
	}

	public selectLanguage(key: string) {
		this.emitter.emitEvent({lang: key});
	}

	public ngOnInit() {
		console.log('ngOnInit: AppNavComponent initialized');

		this.subscription = this.router.events.subscribe((event) => {
			console.log(' > ROUTER EVENT:', event);
			if (!event.hasOwnProperty('reason')) {
				/*
				*	router returns reason with empty string as a value if guard rejects access
				*/
				this.switchNavButtons(event, null);
			} else {
				// switch to login
				this.switchNavButtons({route: 'login'}, null);
			}
		});

		// init supported languages
		this.supportedLanguages = [
			{ key: 'en', name: 'English' },
			{ key: 'ru', name: 'Russian' }
		];
	}

	public ngOnDestroy() {
		console.log('ngOnDestroy: AppNavComponent destroyed');
		this.subscription.unsubscribe();
	}
}
