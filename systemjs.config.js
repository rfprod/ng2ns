/*
*	SystemJS configuration for Angular 6
*/
(function (global) { // eslint-disable-line no-unused-vars

	var paths = {
		'npm:': './node_modules/',
		'pub:': './public/'
	};
	// packages locations
	var map = {
		'app': 																	'pub:app',
		'lazy.module': 													'pub:app/lazy/lazy.module.js',

		'rxjs': 																'npm:rxjs/bundles/rxjs.umd.js',
		'rxjs/ajax': 														'npm:rxjs/ajax',
		'rxjs/operators': 											'npm:rxjs/operators',
		'rxjs/testing': 												'npm:rxjs/testing',
		'rxjs/util': 														'npm:rxjs/util',
		'rxjs/webSocket': 											'npm:rxjs/webSocket',
		'rxjs/internal': 												'npm:rxjs/internal',

		'tslib': 																'npm:tslib/tslib.js',
		'traceur': 															'npm:traceur/bin',
		'@angular/animations': 									'npm:@angular/animations/bundles/animations.umd.js',
		'@angular/animations/browser': 					'npm:@angular/animations/bundles/animations-browser.umd.js',
		'@angular/core': 												'npm:@angular/core/bundles/core.umd.js',
		'@angular/common': 											'npm:@angular/common/bundles/common.umd.js',
		'@angular/common/http': 								'npm:@angular/common/bundles/common-http.umd.js',
		'@angular/compiler': 										'npm:@angular/compiler/bundles/compiler.umd.js',
		'@angular/forms': 											'npm:@angular/forms/bundles/forms.umd.js',
		'@angular/http': 												'npm:@angular/http/bundles/http.umd.js',
		'@angular/platform-browser': 						'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
		'@angular/platform-browser/animations':	'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
		'@angular/platform-browser-dynamic': 		'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
		'@angular/router': 											'npm:@angular/router/bundles/router.umd.js',
		'@angular/flex-layout': 								'npm:@angular/flex-layout/bundles/flex-layout.umd.js',
		'@angular/flex-layout/core': 						'npm:@angular/flex-layout/bundles/flex-layout-core.umd.js',
		'@angular/flex-layout/extended': 				'npm:@angular/flex-layout/bundles/flex-layout-extended.umd.js',
		'@angular/flex-layout/flex': 						'npm:@angular/flex-layout/bundles/flex-layout-flex.umd.js',
		'@angular/flex-layout/server': 					'npm:@angular/flex-layout/bundles/flex-layout-server.umd.js',
		'@angular/flex-layout/grid': 						'npm:@angular/flex-layout/bundles/flex-layout-grid.umd.js',
		'@angular/material': 										'npm:@angular/material/bundles/material.umd.js',
		'@angular/material/core': 							'npm:@angular/material/bundles/material-core.umd.js',
		'@angular/cdk': 												'npm:@angular/cdk/bundles/cdk.umd.js',
		'@angular/cdk/a11y': 										'npm:@angular/cdk/bundles/cdk-a11y.umd.js',
		'@angular/cdk/accordion': 							'npm:@angular/cdk/bundles/cdk-accordion.umd.js',
		'@angular/cdk/bidi': 										'npm:@angular/cdk/bundles/cdk-bidi.umd.js',
		'@angular/cdk/coercion': 								'npm:@angular/cdk/bundles/cdk-coercion.umd.js',
		'@angular/cdk/collections': 						'npm:@angular/cdk/bundles/cdk-collections.umd.js',
		'@angular/cdk/keycodes': 								'npm:@angular/cdk/bundles/cdk-keycodes.umd.js',
		'@angular/cdk/layout': 									'npm:@angular/cdk/bundles/cdk-layout.umd.js',
		'@angular/cdk/observers': 							'npm:@angular/cdk/bundles/cdk-observers.umd.js',
		'@angular/cdk/overlay': 								'npm:@angular/cdk/bundles/cdk-overlay.umd.js',
		'@angular/cdk/platform': 								'npm:@angular/cdk/bundles/cdk-platform.umd.js',
		'@angular/cdk/portal': 									'npm:@angular/cdk/bundles/cdk-portal.umd.js',
		'@angular/cdk/rxjs': 										'npm:@angular/cdk/bundles/cdk-rxjs.umd.js',
		'@angular/cdk/scrolling': 							'npm:@angular/cdk/bundles/cdk-scrolling.umd.js',
		'@angular/cdk/stepper': 								'npm:@angular/cdk/bundles/cdk-stepper.umd.js',
		'@angular/cdk/table': 									'npm:@angular/cdk/bundles/cdk-table.umd.js',
		'@angular/cdk/text-field': 							'npm:@angular/cdk/bundles/cdk-text-field.umd.js',
		'@angular/cdk/tree': 										'npm:@angular/cdk/bundles/cdk-tree.umd.js',
		'@angular/material-moment-adapter': 		'npm:@angular/material-moment-adapter/bundles/material-moment-adapter.umd.js',
		'moment': 															'npm:moment/min/moment-with-locales.min.js'
	};
	// how to load packages
	var packages = {
		'app': 													{ main: 'app', defaultExtension: 'js' },
		'traceur': 											{ main: 'traceur', defaultExtension: 'js' },

		'rxjs/ajax': 										{ main: 'index', defaultExtension: 'js' },
		'rxjs/operators': 							{ main: 'index', defaultExtension: 'js' },
		'rxjs/testing': 								{ main: 'index', defaultExtension: 'js' },
		'rxjs/util': 										{ main: 'index', defaultExtension: 'js' },
		'rxjs/webSocket': 							{ main: 'index', defaultExtension: 'js' },
		'rxjs/internal': 								{ main: 'Rx', defaultExtension: 'js' }
	};
	// defined bundles (where each dependency should be looked up)
	var bundles = {
		'/public/js/app.bundle.min.js': [
			'app'
		],
		'/public/js/dependencies.bundle.min.js': [

			// dependencies
			'npm:ng2-nvd3/build/index.js',

			'npm:rxjs/bundles/rxjs.umd.js',
			'npm:rxjs/ajax/index.js',
			'npm:rxjs/operators/index.js',
			'npm:rxjs/testing/index.js',
			'npm:rxjs/util/index.js',
			'npm:rxjs/webSocket/index.js',
			'npm:rxjs/internal/index.js',

			'npm:tslib/tslib.js',
			'npm:traceur/bin/traceur.js',

			'npm:@angular/animations/bundles/animations.umd.js',
			'npm:@angular/animations/bundles/animations-browser.umd.js',
			'npm:@angular/core/bundles/core.umd.js',
			'npm:@angular/common/bundles/common.umd.js',
			'npm:@angular/common/bundles/common-http.umd.js',
			'npm:@angular/compiler/bundles/compiler.umd.js',
			'npm:@angular/forms/bundles/forms.umd.js',
			'npm:@angular/http/bundles/http.umd.js',
			'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
			'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
			'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
			'npm:@angular/router/bundles/router.umd.js',
			'npm:@angular/flex-layout/bundles/flex-layout.umd.js',
			'npm:@angular/flex-layout/bundles/flex-layout-core.umd.js',
			'npm:@angular/flex-layout/bundles/flex-layout-extended.umd.js',
			'npm:@angular/flex-layout/bundles/flex-layout-flex.umd.js',
			'npm:@angular/flex-layout/bundles/flex-layout-server.umd.js',
			'npm:@angular/flex-layout/bundles/flex-layout-grid.umd.js',
			'npm:@angular/material/bundles/material.umd.js',
			'npm:@angular/cdk/bundles/cdk.umd.js',
			'npm:@angular/cdk/bundles/cdk-a11y.umd.js',
			'npm:@angular/cdk/bundles/cdk-accordion.umd.js',
			'npm:@angular/cdk/bundles/cdk-bidi.umd.js',
			'npm:@angular/cdk/bundles/cdk-coercion.umd.js',
			'npm:@angular/cdk/bundles/cdk-collections.umd.js',
			'npm:@angular/cdk/bundles/cdk-keycodes.umd.js',
			'npm:@angular/cdk/bundles/cdk-layout.umd.js',
			'npm:@angular/cdk/bundles/cdk-observers.umd.js',
			'npm:@angular/cdk/bundles/cdk-overlay.umd.js',
			'npm:@angular/cdk/bundles/cdk-platform.umd.js',
			'npm:@angular/cdk/bundles/cdk-portal.umd.js',
			'npm:@angular/cdk/bundles/cdk-rxjs.umd.js',
			'npm:@angular/cdk/bundles/cdk-scrolling.umd.js',
			'npm:@angular/cdk/bundles/cdk-stepper.umd.js',
			'npm:@angular/cdk/bundles/cdk-table.umd.js',
			'npm:@angular/cdk/bundles/cdk-text-field.umd.js',
			'npm:@angular/cdk/bundles/cdk-tree.umd.js',
			'npm:@angular/material-moment-adapter/bundles/material-moment-adapter.umd.js',
			'npm:moment/min/moment-with-locales.min.js'
		],
		'/public/js/lazy.bundle.min.js': [
			'pub:app/lazy/lazy.module.js',
			'pub:app/lazy/lazy-routing.module.js',
			'pub:app/components/lazy.component.js'
		]
	};

	var config = {
		paths: paths,
		map: map,
		packages: packages,
		bundles: bundles
	};

	System.config(config);

})(this);
