import { Injectable } from '@angular/core';

/**
 * Custom http handlers service.
 */
@Injectable()
export class CustomHttpHandlersService {

	/**
	 * Extracts object from http response.
	 * @param res extracted http response
	 */
	public extractObject(res: object): any {
		return res || {};
	}

	/**
	 * Extracts array from http response.
	 * @param res extracted http response
	 */
	public extractArray(res: any[]): any {
		return res || [];
	}

	/**
	 * Processes http request error.
	 * @param error http request error
	 */
	public handleError(error: any): string {
		console.log('error', error);
		const errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.log('errMsg', errMsg);
		return errMsg;
	}
}
