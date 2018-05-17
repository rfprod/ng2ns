import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';
import { MatDatepicker } from '@angular/material';

import { TranslateService } from '../translate/translate.service';

import { UsersListService } from '../services/users-list.service';

import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/first';

@Component({
	selector: 'dashboard-details',
	templateUrl: '/public/app/views/dashboard-details.html',
	host: {
		class: 'mat-body-1'
	}
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private usersListService: UsersListService,
		private translateService: TranslateService
	) {
		// console.log('this.el.nativeElement:', this.el.nativeElement);
	}

	private ngUnsubscribe: Subject<void> = new Subject();

	private subscriptions: any[] = [];

	public usersList: any[] = [];

	public errorMessage: string;

	private getUsersList(): Promise<boolean> {
		const def = new CustomDeferredService<boolean>();
		this.usersListService.getUsersList().first().subscribe(
			(data) => {
				this.usersList = data;
				def.resolve(true);
			},
			(error) => {
				this.errorMessage = error as any;
				def.reject(false);
			},
			() => {
				console.log('getUserList done');
			}
		);
		return def.promise;
	}

	public mouseEntered(event) {
		console.log('mouse enter', event);
	}
	public mouseLeft(event) {
		console.log('mouse leave', event);
	}

/*
*	search
*/
	private searchValue: string;
	public get searchQuery(): string {
		return this.searchValue;
	}
	public set searchQuery(val: string) {
		this.searchValue = val;
	}
	public hideElement(index) {
		console.log(' > hideElement:', index, this.usersList[index].firstName);
		const result = this.usersList[index].firstName.indexOf(this.searchValue) === -1;
		console.log('result', result);
		return (this.searchValue) ? result : false;
	}

/*
*	sort
*/
	private sortValue: string;
	public get sortByCriterion(): string {
		return this.sortValue;
	}
	public set sortByCriterion(val: string) {
		if (this.sortValue !== val) { // sort if value changed
			this.sortValue = val;
			this.performSorting(val);
		}
	}
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

/*
*	datepicker
*/
	public pickerDate: string = new Date().toISOString();
	@ViewChild('datePicker') private datePicker: MatDatepicker<string>;
	public showDatePicker(event: any): void {
		console.log('showDatePicker', this.datePicker);
		this.datePicker.open();
	}

	public ngOnInit() {
		console.log('ngOnInit: DashboardDetailsComponent initialized');
		this.emitter.emitSpinnerStartEvent();
		this.emitter.emitEvent({appInfo: 'hide'});
		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('/data consuming event:', JSON.stringify(event));
			// TODO
		});
		this.subscriptions.push(sub);

		this.getUsersList().then(() => {
			console.log('all models updated');
			this.emitter.emitSpinnerStopEvent();
		});
	}
	public ngOnDestroy() {
		console.log('ngOnDestroy: DashboardDetailsComponent destroyed');
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
