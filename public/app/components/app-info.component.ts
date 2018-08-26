import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from '../services/event-emitter.service';

import { IBadge } from '../interfaces/index';

/**
 * Application infor component.
 */
@Component({
	selector: 'app-info',
	template: `
		<a class="flex-item" [hidden]="hideInfo" *ngFor="let badge of badges" href="{{badge.link}}" data-toggle="tooltip" target=_blank title="{{badge.title}}">
			<img src="{{badge.img}}"/>
		</a>
	`,
	host: {
		class: 'mat-body-1'
	}
})
export class AppInfoComponent implements OnInit, OnDestroy {

	/**
	 * @param emitter Event emitter service - components interaction
	 */
	constructor(
		private emitter: EventEmitterService
	) {}

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Indicates if info should be hidden or not.
	 */
	public hideInfo: boolean = true;
	/**
	 * Badges.
	 */
	public badges: IBadge[] = [
		{
			title: 'Angular - (commonly referred to as "Angular 2+" or "Angular 2") is a TypeScript-based open-source front-end web application platform led by the Angular Team at Google and by a community of individuals and corporations to address all of the parts of the developer\'s workflow while building complex web applications. Angular is a complete rewrite from the same team that built AngularJS.',
			link: 'https://en.wikipedia.org/wiki/Angular_(application_platform)',
			img: '/public/img/Angular_logo.svg',
		},
		{
			title: 'Node.js - an open-source, cross-platform runtime environment for developing server-side Web applications.',
			link: 'https://en.wikipedia.org/wiki/Node.js',
			img: '/public/img/Node.js_logo.svg',
		}
	];

	/**
	 * Lifecycle hook called on component initialization.
	 */
	public ngOnInit() {
		console.log('ngOnInit: AppInfoComponent initialized');
		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			// console.log('app-info consuming event:', event);
			if (event.appInfo === 'hide') { this.hideInfo = true; }
			if (event.appInfo === 'show') { this.hideInfo = false; }
		});
		this.subscriptions.push(sub);
	}
	/**
	 * Lifecycle hook called on component destruction.
	 */
	public ngOnDestroy() {
		console.log('ngOnDestroy: AppInfoComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
