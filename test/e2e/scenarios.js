'use strict';

/*
*	API DOC: http://www.protractor.org/#/api
*/

describe('Ng2NMC e2e: ', function() {

	const EC = protractor.ExpectedConditions;

	it('should load index view', function() {

		browser.get('/');
		browser.getCurrentUrl().then(function(url) {
			expect(url).toMatch('/intro$');

			var root = element.all(by.css('root'));
			browser.wait(EC.presenceOf(root), 10000);
			expect(root.count()).toBe(1);
		});

	});

});
