import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { EventEmitterService } from '../services/event-emitter.service';
import { UserService } from '../services/user.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
	selector: 'app-nav',
	templateUrl: '/public/app/views/dashboard-nav.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppNavComponent implements OnInit, OnDestroy {

	constructor(
		private emitter: EventEmitterService,
		private userService: UserService,
		private router: Router
	) {}

	private ngUnsubscribe: Subject<void> = new Subject();
	public navButtonsState: boolean[] = [false, false, false, false];

	public supportedLanguages: any[];

	public switchNavButtons(event: any, path?: string) {
		/*
		*	accepts router event, and optionally path which contains name of activated path
		*	if path parameter is passed, event parameter will be ignored
		*/
		let index;
		console.log('switchNavButtons:', event);
		const route = (event.route) ? event.route : (typeof event.urlAfterRedirects === 'string') ? event.urlAfterRedirects : event.url;
		// remove args from route if present
		path = (!path) ? route.replace(/\?.*$/, '').substring(route.lastIndexOf('/') + 1, route.length) : path;
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

	private logOut() {
		const token = this.userService.getUser().token;
		this.userService.SaveUser({ token: '' });
		this.router.navigate(['']);
	}

	public selectLanguage(key: string) {
		this.emitter.emitEvent({lang: key});
	}

	public ngOnInit() {
		console.log('ngOnInit: AppNavComponent initialized');

		this.router.events.takeUntil(this.ngUnsubscribe).subscribe((event: any) => {
			// console.log(' > ROUTER EVENT:', event);
			if (event instanceof NavigationEnd) {
				console.log(' > ROUTER > NAVIGATION END, event', event);
				this.switchNavButtons(event);

				/*
				*	TODO
				*	close toaster on navigation end later if needed
				*/
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
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
