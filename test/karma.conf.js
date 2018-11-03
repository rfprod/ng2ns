const testUtils = require('./test-utils');
const headlessChromeFlags = testUtils.headlessChromeFlags();
const karmaBrowserTimeoutValue = testUtils.karmaBrowserTimeoutValue();

const os = require('os');

module.exports = function(config) {
	/**
	 * cpu cores for karma-parallel plugin
	 */
	const useCPUcores = Math.ceil(os.cpus().length / 2);

	/**
	 * Settings depending on tests execution envitonment:
	 * frameworks, browsers, plugins, parallelOprions, browserConsoleLogOptions
	 */
	const conf = {
		frameworks: testUtils.isDocker() || testUtils.isCI() ? ['sharding', 'jasmine'] : ['parallel', 'jasmine'],
		browsers: testUtils.isDocker() || testUtils.isCI() ? Array.apply(null, Array(4)).map(String.prototype.valueOf, 'ChromeHeadless') : ['ChromeHeadless'],
		plugins: testUtils.isDocker() || testUtils.isCI() ? [
			'karma-sharding',
			'karma-redirect-preprocessor',
			'karma-chrome-launcher',
			'karma-html-reporter',
			'karma-sourcemap-loader',
			'karma-coverage',
			'karma-jasmine'
		] : [
			'karma-parallel',
			'karma-redirect-preprocessor',
			'karma-chrome-launcher',
			'karma-html-reporter',
			'karma-sourcemap-loader',
			'karma-coverage',
			'karma-jasmine'
		],
		parallelOptions: testUtils.isDocker() || testUtils.isCI() ? {} : {
			executors: useCPUcores,
			shardStrategy: 'description-length'
		},
		browserConsoleLogOptions: {
			level: 'debug',
			format: '%b %T %m',
			path: 'logs/unit/browser-console.log',
			terminal: testUtils.isDocker() ? true : false // don't show log when running tests locally, it is faster, but show in docker
		}
	};

	const options = {

		basePath : '../',
		
		files : [
			'node_modules/d3/dist/d3.js',

			'node_modules/core-js/client/shim.js',
			'node_modules/reflect-metadata/Reflect.js',

			'node_modules/zone.js/dist/zone.js',
			'node_modules/zone.js/dist/long-stack-trace-zone.js',
			'node_modules/zone.js/dist/proxy.js',
			'node_modules/zone.js/dist/sync-test.js',
			'node_modules/zone.js/dist/jasmine-patch.js',
			'node_modules/zone.js/dist/async-test.js',
			'node_modules/zone.js/dist/fake-async-test.js',

			'node_modules/moment/min/moment-with-locales.min.js',

			'node_modules/systemjs/dist/system.src.js',
			{ pattern: 'node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css' },

			{ pattern: 'systemjs.config.js', included: false, watched: false },
			{ pattern: 'systemjs.karma.config.js', included: false, watched: false },
			{ pattern: 'systemjs.config.extras.js', included: false, watched: false },
			
			'node_modules/hammerjs/hammer.js',
			{ pattern: 'node_modules/@angular/**', included: false, watched: false },
			{ pattern: 'node_modules/rxjs/**', included: false, watched: false },

			{ pattern: 'node_modules/tslib/**', included: false, watched: false },
			{ pattern: 'node_modules/traceur/**', included: false, watched: false },

			'test/karma.test-shim.js',
			{ pattern: 'test/client/**', included: false, watched: false },
			/*
			* SPEC ISOLATION
			* to test an isolated spec comment out the previous line, and use the next one (set correct spec path)
			*/
			// { pattern: 'test/client/app-component.spec.js', included: false, watched: false },

			{ pattern: 'public/app/**', included: false, watched: false },

			{ pattern: 'public/service-worker.js', included: false, watched: false },

			{ pattern: 'public/webfonts/**', included: false, watched: false },

			{ pattern: 'public/img/**', included: false, watched: false },
		],

		proxies: {
			'/service-worker.js': '/base/public/service-worker.js',
			'/public/webfonts/': '/base/public/webfonts/',
			'/public/img/': '/base/public/img/'
		},

		// exclude: [],

		frameworks: conf.frameworks,

		browserNoActivityTimeout: karmaBrowserTimeoutValue,
		browserDisconnectTimeout: karmaBrowserTimeoutValue,
		customLaunchers: {
			/*
			*	this custom launcher requires setting env var CHROME_BIN=chromium-browser
			*	possible options for env var value depending on what you have installed:
			*	chromium-browser, chromium, google-chrome
			*/
			ChromeHeadless: {
				base: 'Chrome',
				flags: headlessChromeFlags
			}
		},
		browsers: conf.browsers,
		
		plugins: conf.plugins,

		preprocessors: {
			'public/**/*.html': ['redirect'],
			'public/app/**/!(*.spec).js': ['coverage'],
			'public/app/**/*.js': ['sourcemap']
		},

		redirectPreprocessor: {
			// stripPrefix: '',
			// stripSuffix: '',
			// prependPrefix: ''
		},

		reporters: ['progress', 'coverage', 'html'],
		coverageReporter: {
			dir: 'logs/',
			reporters: [
				{ type: 'json', subdir: 'coverage'}
			]
		},
		htmlReporter: {
			outputDir: 'logs/unit',
			templatePath: null,
			focusOnFailures: true,
			namedFiles: false,
			pageTitle: 'Ng2NS Client Unit Tests',
			urlFriendlyName: true,
			reportName: 'client'
		},

		failOnEmptyTestSuite: false, // overrides the error, warn instead - by default returns error if there're no tests defined

		hostname: process.env.IP,
		port: process.env.PORT,
		runnerPort: 0,

		autoWatch: true,
		singleRun: true,
		colors: true,

		logLevel: config.LOG_ERROR, // LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
		browserConsoleLogOptions: conf.browserConsoleLogOptions

	};

	if (!testUtils.isDocker() && !testUtils.isCI()) {
		console.log(`Karma will use ${useCPUcores} cpu cores for parallel testing`);
		options.parallelOptions = conf.parallelOptions;
	}

	config.set(options);
};
