const pkg = require('../package.json');

const conf = {
	jsdocServer: require('../jsdoc-server.json'),
	jsdocBuild: require('../jsdoc-build.json')
};

module.exports = {
	/*
	* Server documentation
	*/
	server: {
		jsdoc: {
			gulp: {
				src: ['./server.js', './app/**/*.js'],
				options: { read: false }
			},
			config: conf.jsdocServer
		},
		unit: {
			gulp: {
				src: ['./test/server/*.js'],
				options: { read: false }
			},
			mocha: {
				options: { reporter: 'good-mocha-html-reporter' }
			},
			report: {
				src: './report.html',
				dest: './logs/unit/server/index.html',
				dir: {
					server: './logs/unit/server',
					unit: './logs/unit'
				}
			}
		}
	},
	/*
	* Build system documentation
	*/
	build: {
		jsdoc: {
			gulp: {
				src: ['./gulpfile.js', './build-system/**/*.js'],
				options: { read: false }
			},
			config: conf.jsdocBuild
		}
	},
	/*
	* Client documentation
	*/
	client: {
		typedoc: {
			gulp: {
				src: ['public/app/**/*.ts'],
				options: { read: false }
			},
			config: {
				// typescript options (see typescript docs)
				allowSyntheticDefaultImports: true,
				alwaysStrict: true,
				importHelpers: true,
				emitDecoratorMetadata: true,
				esModuleInterop: true,
				experimentalDecorators: true,
				module: 'commonjs',
				moduleResolution: 'node',
				noImplicitAny: false,
				removeComments: true,
				sourceMap: true,
				suppressImplicitAnyIndexErrors: true,
				target: 'es2017',
				// output options (see typedoc docs: http://typedoc.org/api/index.html)
				readme: './README.md',
				out: './logs/typedoc',
				json: './logs/typedoc/typedoc-output.json',
				// typedoc options (see typedoc docs: http://typedoc.org/api/index.html)
				name: 'Ng2NS Client',
				theme: 'default',
				//plugins: [], // set to none to use no plugins, omit to use all
				includeDeclarations: false,
				ignoreCompilerErrors: true,
				version: true
			}
		}
	},
	/*
	* Hashsum
	*/
	hashsum: {
		gulp: {
			src: ['./public/*', '!./public/SHA1SUMS.json', './public/app/views/**', './public/css/**', './public/webfonts/**', './public/img/**', './public/js/**']
		},
		config: {
			filename: 'public/SHA1SUMS.json',
			hash: 'sha1',
			json: true
		}
	},
	/*
	* Environment
	*/
	env: {
		sha1SumsJson: './public/SHA1SUMS.json',
		hmacSHA: 'sha256',
		envPath: {
			express: './.env',
			functions: './functions/.env'
		},
		port: '8080',
		appUrl: 'http://localhost:8080',
		appVersion: pkg.version
	},
	/*
	* Systemjs build
	*/
	systemjs: {
		gulp: {
			dest: './public/js'
		},
		baseDir: './',
		builderConfig: './systemjs.config.js',
		moduleName: 'app',
		dependenciesBundleName: 'dependencies.bundle.min.js',
		lazyBundleName: 'lazy.bundle.min.js',
		appBundleName: 'app.bundle.min.js',
		builderOptions: {
			minify: true,
			mangle: true
		}
	},
	/*
	* Vendor
	*/
	vendor: {
		/*
		* Vendor js
		*/
		js: {
			gulp: {
				src: [
					/*
					*	add paths to required third party js libraries here
					*/

					// TODO:build required for lazy loading, uncomment when needed (both systemjs config, and src)
					'./node_modules/systemjs/dist/system.src.js',
					'./systemjs.config.js',

					// angular requirements
					'./node_modules/core-js/client/shim.js',
					'./node_modules/zone.js/dist/zone.min.js',
					'./node_modules/reflect-metadata/Reflect.js',

					'./node_modules/d3/dist/d3.js'
				],
				dest: './public/js'
			},
			bundleName: 'vendor-bundle.min.js'
		},
		/*
		* Vendor css
		*/
		css: {
			gulp: {
				src: [
					/*
					*	add paths to required third party css files
					*/
					'./node_modules/components-font-awesome/css/fontawesome-all.css',
					/*
					*	Angular material theme should be chosen and loaded here
					*/
					'./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css'
					//'./node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
					//'./node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css'
					//'./node_modules/@angular/material/prebuilt-themes/purple-green.css'
				],
				dest: './public/css'
			},
			bundleName: 'vendor-bundle.min.css'
		},
		/*
		* Vendor fonts
		*/
		fonts: {
			src: [
				'./node_modules/components-font-awesome/webfonts/*.*',
				// material design icons
				'./node_modules/material-design-icon-fonts/iconfont/*.eot',
				'./node_modules/material-design-icon-fonts/iconfont/*.woff2',
				'./node_modules/material-design-icon-fonts/iconfont/*.woff',
				'./node_modules/material-design-icon-fonts/iconfont/*.ttf'
			],
			dest: './public/webfonts'
		}
	},
	/*
	* Sass
	*/
	sass: {
		gulp: {
			src: ['./public/app/scss/*.scss'],
			dest: './public/css'
		},
		browsers: ['last 2 versions'],
		bundleName: 'bundle.min.css'
	},
	/*
	* Eslint
	*/
	eslint: {
		gulp: {
			src: ['./*.js', './app/**/*.js', './public/{electron.preload,service-worker}.js', './test/*.js', './test/e2e/scenarios.js', './test/server/test.js']
		},
		eslintrc: './.eslintrc.json'
	},
	/*
	* Tslint
	*/
	tslint: {
		gulp: {
			src: ['./public/app/*.ts', './public/app/**/*.ts', '!./public/app/{scss,views}/', './test/client/**/*.ts'],
		},
		options: {
			formatter: 'verbose' // 'verbose' - extended info | 'prose' - brief info
		},
		reportOptions: {
			emitError: false
		}
	}
}
