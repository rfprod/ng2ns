import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

@Injectable()
export class UsersListService {
	constructor(
		private http: HttpClient,
		@Inject('Window') private window: Window,
		private httpHandlers: CustomHttpHandlersService
	) {
		console.log('UsersListService init');
	}

	private appDataUrl: string = this.window.location.origin + '/api/users';

	public getUsersList(): Observable<any[]> {
		return this.http.get(this.appDataUrl).pipe(
			take(1),
			map(this.httpHandlers.extractArray),
			catchError(this.httpHandlers.handleError)
		);
	}
}
