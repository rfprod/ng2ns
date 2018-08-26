import { Injectable } from '@angular/core';

/**
 * User service - wrapper around browser local storage.
 */
@Injectable()
export class UserService {

	constructor() {
		this.model.email = null;
		this.model.token = null;
		this.modelKeys = Object.keys(this.model);
		if (typeof localStorage.getItem('userService') === 'undefined' && !localStorage.getItem('userService')) {
			localStorage.setItem('userService', JSON.stringify(this.model));
		} else {
			this.RestoreUser();
		}
		console.log(' >> USER SERVICE CONSTRUCTOR, model', this.model);
	}

	/**
	 * User model.
	 */
	private model: any = {
		email: null,
		token: null
	};

	/**
	 * User model keys.
	 */
	private modelKeys: any[];

	/**
	 * Returns current user model.
	 */
	public getUser(): any {
		return this.model;
	}

	/**
	 * Returns current user token.
	 */
	public isLoggedIn(): string {
		return this.model.token;
	}

	/**
	 * Saves new user model values.
	 * @param newValues object with new user model values
	 */
	public SaveUser(newValues: { email?: string, token?: string }): void {
		console.log('SaveUser', newValues);
		if (newValues.hasOwnProperty('email')) {
			this.model.email = newValues.email;
		}
		if (newValues.hasOwnProperty('token')) {
			this.model.token = newValues.token;
		}
		localStorage.setItem('userService', JSON.stringify(this.model));
	}

	/**
	 * Restores user model.
	 */
	public RestoreUser(): void {
		console.log('Restore User, localStorage.userService:', localStorage.getItem('userService'));
		if (typeof localStorage.getItem('userService') !== 'undefined' && localStorage.getItem('userService')) {
			this.model = JSON.parse(localStorage.getItem('userService'));
		}
	}

	/**
	 * Resets user model.
	 */
	public ResetUser(): void {
		for (const key of this.modelKeys) {
			this.model[key] = null;
		}
		localStorage.setItem('userService', JSON.stringify(this.model));
	}
}
