import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
	selector: 'lazy-component',
	templateUrl: '/public/app/views/lazy.html',
	host: {
		class: 'mat-body-1'
	}
})
export class LazyComponent implements OnInit, OnDestroy {

	private subscriptions: any[] = [];

/*
*	component lifecycle
*/
	public ngOnInit(): void {
		console.log('ngOnInit: LazyComponent initialized');
	}
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: LazyComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
