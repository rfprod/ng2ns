import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CustomHttpHandlersService } from './custom-http-handlers.service';

import { Observable } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

/**
 * Server static data service.
 */
@Injectable()
export class ServerStaticDataService {

	/**
	 * @param http Http Client
	 * @param window Window - window reference
	 * @param httpHandlers Custom Http Handlers Service
	 */
	constructor(
		private http: HttpClient,
		@Inject('Window') private window: Window,
		private httpHandlers: CustomHttpHandlersService
	) {
		console.log('ServerStaticDataService init');
	}

	/**
	 * Endpoint to make request to.
	 */
	private endpoint: string = this.window.location.origin + '/api/app-diag/static';

	/**
	 * Gets server static data.
	 */
	public getData(): Observable<any[]> {
		return this.http.get(this.endpoint).pipe(
			take(1),
			map(this.httpHandlers.extractArray),
			catchError(this.httpHandlers.handleError)
		);
	}
}
