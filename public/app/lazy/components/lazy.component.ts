import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * Lazily loaded component.
 */
@Component({
	selector: 'lazy-component',
	templateUrl: '/public/app/views/lazy.html',
	host: {
		class: 'mat-body-1'
	}
})
export class LazyComponent implements OnInit, OnDestroy {

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Lifecycle hook called on component initialization.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: LazyComponent initialized');
	}
	/**
	 * Lifecycle hook called on component destruction.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: LazyComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
