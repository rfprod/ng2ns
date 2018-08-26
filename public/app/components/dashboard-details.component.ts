import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';
import { MatDatepicker } from '@angular/material';

import { TranslateService } from '../translate/translate.service';

import { UsersListService } from '../services/users-list.service';

/**
 * Dashboard details component.
 */
@Component({
	selector: 'dashboard-details',
	templateUrl: '/public/app/views/dashboard-details.html',
	host: {
		class: 'mat-body-1'
	}
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {

	/**
	 * @param el Element reference
	 * @param emitter Event emitter service - components interaction
	 * @param usersListService Users list service - retrieves users list over API
	 * @param translateService Translate service - UI translation to predefined languages
	 */
	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private usersListService: UsersListService,
		private translateService: TranslateService
	) {
		// console.log('this.el.nativeElement:', this.el.nativeElement);
	}

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Users list retrieved over api.
	 */
	public usersList: any[] = [];

	/**
	 * Retrieves users list over api.
	 */
	private getUsersList(): Promise<void> {
		const def = new CustomDeferredService<void>();
		this.usersListService.getUsersList().subscribe(
			(data: any[]) => {
				this.usersList = data;
				def.resolve();
			},
			(error: any) => null, // service catches error
			() => {
				console.log('getUserList done');
			}
		);
		return def.promise;
	}

	/**
	 * Mouse entered event handler.
	 */
	public mouseEntered(event) {
		console.log('mouse enter', event);
	}
	/**
	 * Mouse left event handler.
	 */
	public mouseLeft(event) {
		console.log('mouse leave', event);
	}

	/**
	 * Filters search value.
	 */
	private searchValue: string;
	/**
	 * Filters search query getter.
	 */
	public get searchQuery(): string {
		return this.searchValue;
	}
	/**
	 * Filters search query setter.
	 */
	public set searchQuery(val: string) {
		this.searchValue = val;
	}
	/**
	 * Hides element conditionally.
	 */
	public hideElement(index) {
		console.log(' > hideElement:', index, this.usersList[index].firstName);
		const result = this.usersList[index].firstName.indexOf(this.searchValue) === -1;
		console.log('result', result);
		return (this.searchValue) ? result : false;
	}

	/**
	 * Filters sort value.
	 */
	private sortValue: string;
	/**
	 * Filters sort value getter.
	 */
	public get sortByCriterion(): string {
		return this.sortValue;
	}
	/**
	 * Filters sort value setter.
	 */
	public set sortByCriterion(val: string) {
		if (this.sortValue !== val) { // sort if value changed
			this.sortValue = val;
			this.performSorting(val);
		}
	}
	/**
	 * Performs sorting based on provided value.
	 */
	private performSorting(val: string): void {
		if (val === 'registered') {
			this.usersList.sort((a, b) => parseInt(a[val], 10) - parseInt(b[val], 10));
		} else if (val === 'role') {
			this.usersList.sort((a, b) => {
				if (a[val] < b[val]) { return -1; }
				if (a[val] > b[val]) { return 1; }
				return 0;
			});
		} else if (val === '') {
			/*
			*	sort by id if sorting is set to none
			*/
			this.usersList.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
		}
	}

	/**
	 * Datepicker date.
	 */
	public pickerDate: string = new Date().toISOString();
	/**
	 * Datepicker view child reference.
	 */
	@ViewChild('datePicker') private datePicker: MatDatepicker<string>;
	/**
	 * Calls datepicker.
	 */
	public showDatePicker(event: any): void {
		console.log('showDatePicker', this.datePicker);
		this.datePicker.open();
	}

	/**
	 * Lifecycle hook called on component initialization.
	 */
	public ngOnInit() {
		console.log('ngOnInit: DashboardDetailsComponent initialized');
		this.emitter.emitSpinnerStartEvent();
		this.emitter.emitEvent({appInfo: 'hide'});
		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('/data consuming event:', JSON.stringify(event));
			// TODO
		});
		this.subscriptions.push(sub);

		this.getUsersList()
			.then(() => {
				console.log('all models updated');
				this.emitter.emitSpinnerStopEvent();
			})
			.catch((error: string) => console.log('dashboard details init requests error'));
	}
	/**
	 * Lifecycle hook called on component destruction.
	 */
	public ngOnDestroy() {
		console.log('ngOnDestroy: DashboardDetailsComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
