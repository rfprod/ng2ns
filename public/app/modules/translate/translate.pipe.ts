import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

/**
 * Translate pipe.
 */
@Pipe({
	name: 'translate',
	pure: false // this should be set to false fro values to be updated on language change
})
export class TranslatePipe implements PipeTransform {

	/**
	 * @param translateService Translate service
	 */
	constructor(
		private translateService: TranslateService
	) {}

	/**
	 * Returns provided dictionary key value.
	 * @param value dictionary key
	 * @param args passed arguments
	 */
	public transform(value: string, args: any[]): any {
		if (!value) { return; }
		return this.translateService.instant(value);
	}

}
