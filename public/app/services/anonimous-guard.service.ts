import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from './user.service';
import { Router } from '@angular/router';

/**
 * Anonimous guard service.
 */
@Injectable()
export class AnonimousGuard implements CanActivate {

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
		if (token) {
			console.log('>> ROUTER GUARD, AnonimousGuard: token present');
			this.router.navigate(['profile']);
		}
		return (!token) ? true : false;
	}
}
