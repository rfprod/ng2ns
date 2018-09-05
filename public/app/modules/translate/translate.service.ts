import { Injectable, Inject } from '@angular/core';
import { TRANSLATIONS } from './translations'; // injection token reference

/**
 * Translate service (UI multilingual support).
 */
@Injectable()
export class TranslateService {

	/**
	 * @param translations Dictionaries
	 */
	constructor(
		@Inject(TRANSLATIONS) private translations: any
	) {}

	/**
	 * Current language value.
	 */
	private _currentLanguage: string;

	/**
	 * Current language getter.
	 */
	public get currentLanguage() {
		return this._currentLanguage;
	}

	/**
	 * Uses specific language for UI.
	 * @param key language key
	 */
	public use(key: string): void {
		this._currentLanguage = key;
	}

	/**
	 * Returns dictionary key value.
	 * Instant translation resolution.
	 * @param key dictionary key
	 */
	private translate(key: string): string {
		const translation = key;
		if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
			return this.translations[this.currentLanguage][key];
		}
		return translation;
	}

	/**
	 * Public instant translation resolution method.
	 * @param key dictionary key
	 */
	public instant(key: string) {
		/*
		*	public method for
		*	instant translation resolution
		*/
		return this.translate(key);
	}
}
