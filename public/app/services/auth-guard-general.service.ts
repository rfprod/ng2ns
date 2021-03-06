import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from './user.service';
import { Router } from '@angular/router';

/**
 * General authentication guard service.
 */
@Injectable()
export class AuthGuardGeneral implements CanActivate {

	/**
	 * @param userService User Service
	 * @param router Router - application router
	 */
	constructor(
		private userService: UserService,
		private router: Router
	) {}

	/**
	 * Guard canActivate method.
	 */
	public canActivate(): boolean {
		const token: string = this.userService.isLoggedIn();
		console.log('ROUTER GUARD, can activate, token', token);
		if (!token) {
			window.alert('to access data you need to log in first, use any valid credentials');
			this.router.navigate(['login']);
		}
		return (token) ? true : false;
	}
}
