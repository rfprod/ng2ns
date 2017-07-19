/*
*	SystemJS configuration for Angular 4+
*/
(function (global) { // eslint-disable-line no-unused-vars

	var paths = {
		'npm:': './base/node_modules/'
	};
	// packages locations
	var map = {
		'app': 																	'./base/public/app',
		'ng2-nvd3': 														'npm:ng2-nvd3/build/lib',
		'rxjs': 																'npm:rxjs',
		'traceur': 															'npm:traceur/bin',
		'@angular/animations': 									'npm:@angular/animations/bundles',
		'@angular/animations/browser': 					'npm:@angular/animations/bundles',
		'@angular/core': 												'npm:@angular/core/bundles',
		'@angular/common': 											'npm:@angular/common/bundles',
		'@angular/compiler': 										'npm:@angular/compiler/bundles',
		'@angular/forms': 											'npm:@angular/forms/bundles',
		'@angular/http': 												'npm:@angular/http/bundles',
		'@angular/platform-browser': 						'npm:@angular/platform-browser/bundles',
		'@angular/platform-browser/animations':	'npm:@angular/platform-browser/bundles',
		'@angular/platform-browser-dynamic': 		'npm:@angular/platform-browser-dynamic/bundles',
		'@angular/router': 											'npm:@angular/router/bundles'
	};
	// how to load packages
	var packages = {
		'app': 												{ main: 'app', defaultExtension: 'js' },
		'ng2-nvd3': 									{ main: 'ng2-nvd3', defaultExtension: 'js' },
		'rxjs': 											{ main: 'Rx', defaultExtension: 'js' },
		'traceur': 										{ main: 'traceur', defaultExtension: 'js' },

		'@angular/animations': 									{ main: 'animations', defaultExtension: 'umd.js' },
		'@angular/animations/browser': 					{ main: 'animations-browser', defaultExtension: 'umd.js' },
		'@angular/core': 												{ main: 'core', defaultExtension: 'umd.js' },
		'@angular/common': 											{ main: 'common', defaultExtension: 'umd.js' },
		'@angular/compiler': 										{ main: 'compiler', defaultExtension: 'umd.js' },
		'@angular/forms': 											{ main: 'forms', defaultExtension: 'umd.js' },
		'@angular/http': 												{ main: 'http', defaultExtension: 'umd.js' },
		'@angular/platform-browser': 						{ main: 'platform-browser', defaultExtension: 'umd.js' },
		// '@angular/platform-browser/animations': { main: 'platform-browser-animations', defaultExtension: 'umd.js' },
		'@angular/platform-browser-dynamic': 		{ main: 'platform-browser-dynamic', defaultExtension: 'umd.js' },
		'@angular/router': 											{ main: 'router', defaultExtension: 'umd.js' }
	};

	var config = {
		paths: paths,
		map: map,
		packages: packages,
		transplier: 'babel'
	};

	System.config(config);

})(this);
