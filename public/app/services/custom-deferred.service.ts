import { Injectable } from '@angular/core';

/**
 * Custom deferred service.
 */
@Injectable()
export class CustomDeferredService<T> {

	constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	/**
	 * Promise.
	 */
	public promise: Promise<T>;

	/**
	 * Resolve.
	 */
	public resolve: (value?: T | PromiseLike<T>) => void;

	/**
	 * Reject.
	 */
	public reject: (reason?: any) => void;

}
