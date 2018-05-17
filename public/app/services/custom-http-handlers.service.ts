import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';

@Injectable()
export class CustomHttpHandlersService {

	public extractObject(res: Response): any {
		return (res) ? res.json() : {};
	}

	public extractArray(res: Response): any {
		return (res) ? res.json() : [];
	}

	public handleError(error: any): Observable<string> {
		const errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.log(errMsg);
		return Observable.throw(errMsg);
	}

}
