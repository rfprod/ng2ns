import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { EventEmitterService } from '../services/event-emitter.service';
import { UserService } from '../services/user.service';

/**
 * Application login component.
 */
@Component({
	selector: 'app-login',
	templateUrl: '/public/app/views/app-login.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppLoginComponent implements OnInit, OnDestroy {

	/**
	 * @param el Element reference
	 * @param emitter Event emitter service - components interaction
	 * @param fb Form builder
	 * @param router Router - application router
	 * @param userService User service - browser local storage wrapper
	 */
	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private fb: FormBuilder,
		private router: Router,
		private userService: UserService
	) {
		// console.log('this.el.nativeElement:', this.el.nativeElement);
		console.log('localStorage.userService', localStorage.getItem('userService'));
		const restoredModel: any = this.userService.getUser();
		console.log('restoredModel use model', restoredModel);
		this.loginForm = this.fb.group({
			email: [restoredModel.email, Validators.compose([Validators.required, Validators.email, Validators.minLength(7)])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
		});
	}

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Login form group.
	 */
	public loginForm: FormGroup;
	/**
	 * Resets login form.
	 */
	public resetForm(): void {
		this.loginForm.reset({
			email: null,
			password: null
		});
		this.userService.ResetUser();
	}
	/**
	 * Submits login form.
	 */
	public submitForm(): void {
		console.log('SUBMIT', this.loginForm);
		if (this.loginForm.valid) {
			this.errorMessage = null;
			this.userService.SaveUser({ email: this.loginForm.controls.email.value, token: 'mockedToken' });
			this.router.navigate(['data']);
		} else {
			this.errorMessage = 'Invalid form input';
		}
	}
	/**
	 * UI error message.
	 */
	public errorMessage: string;

	/**
	 * Lifecycle hook called on component initialization.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: AppLoginComponent initialized');
		this.emitter.emitSpinnerStartEvent();
		this.emitter.emitEvent({appInfo: 'hide'});
		this.emitter.emitSpinnerStopEvent();
	}
	/**
	 * Lifecycle hook called on component destruction.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppLoginComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
