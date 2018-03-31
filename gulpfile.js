'use strict';

const gulp = require('gulp'),
	runSequence = require('run-sequence'),
	util = require('gulp-util'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	eslint = require('gulp-eslint'),
	tslint = require('gulp-tslint'),
	plumber = require('gulp-plumber'),
	replace = require('gulp-replace'),
	mocha = require('gulp-mocha'),
	karmaServer = require('karma').Server,
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	autoprefixer = require('gulp-autoprefixer'),
	systemjsBuilder = require('gulp-systemjs-builder'),
	hashsum = require('gulp-hashsum'),
	crypto = require('crypto'),
	fs = require('fs'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec;
let node,
	tsc,
	protractor;

function killProcessByName(name) {
	exec('pgrep ' + name, (error, stdout, stderr) => {
		if (error) {
			// throw error;
			console.log('killProcessByName, error', error);
		}
		if (stderr) console.log('stderr:', stderr);
		if (stdout) {
			//console.log('killing running processes:', stdout);
			const runningProcessesIDs = stdout.match(/\d+/);
			runningProcessesIDs.forEach((id) => {
				exec('kill -9 ' + id, (error, stdout, stderr) => {
					if (error) throw error;
					if (stderr) console.log('stdout:', stdout);
					if (stdout) console.log('stderr:', stderr);
				});
			});
		}
	});
}

/*
*	hashsum identifies build
*
*	after build SHA1SUMS.json is generated with sha1 sums for different files
*	then sha256 is calculated using stringified file contents
*/
gulp.task('hashsum', () => {
	return gulp.src(['./public/*', '!./public/SHA1SUMS.json', './public/app/views/**', './public/css/**', './public/webfonts/**', './public/img/**', './public/js/**'])
		.pipe(hashsum({ filename: 'public/SHA1SUMS.json', hash: 'sha1', json: true }));
});

function createEnvFile(env, done) {
	fs.readFile('./public/SHA1SUMS.json', (err, data) => {
		if (err) throw err;
		const hash = crypto.createHmac('sha256', data.toString()).digest('hex');
		console.log('BUILD_HASH', hash);
		env += 'BUILD_HASH=' + hash + '\n';
		fs.writeFile('./.env', env, (err) => {
			if (err) throw err;
			console.log('# > ENV > .env file was created');
			done();
		});
	});
}

gulp.task('create-env-development', (done) => {
	/*
	*	create .env file for development
	*/
	const pkg = require('./package.json');
	fs.readFile('./.env', (err, data) => {
		const env = 'PORT=8080\nAPP_URL=http://localhost:8080/\nAPP_VERSION=' + pkg.version + '\nDEV_MODE=true\n';
		if (err) {
			createEnvFile(env, done);
		} else {
			if (data.toString() === env) {
				console.log('# > ENV > .env file is correct');
				done();
			} else {
				createEnvFile(env, done);
			}
		}
	});
});

gulp.task('create-env-development-cluster', (done) => {
	/*
	*	create .env file for development
	*/
	const pkg = require('./package.json');
	fs.readFile('./.env', (err, data) => {
		const env = 'PORT=8080\nAPP_URL=http://localhost:8080/\nAPP_VERSION=' + pkg.version + '\nDEV_MODE=false\n';
		if (err) {
			createEnvFile(env, done);
		} else {
			if (data.toString() === env) {
				console.log('# > ENV > .env file is correct');
				done();
			} else {
				createEnvFile(env, done);
			}
		}
	});
});

gulp.task('create-env-electron', (done) => {
	/*
	*	create .env file for electron
	*/
	const pkg = require('./package.json');
	fs.readFile('./.env', (err, data) => {
		const env = 'PORT=8080\nAPP_URL=http://localhost:8080/\nAPP_VERSION=' + pkg.version + '\nELECTRON=true\nNODE_ENV=production';
		if (err) {
			createEnvFile(env, done);
		} else {
			if (data.toString() === env) {
				console.log('# > ENV > .env file is correct');
				done();
			} else {
				createEnvFile(env, done);
			}
		}
	});
});

gulp.task('server', (done) => {
	if (node) node.kill();
	node = spawn('node', ['server.js'], {stdio: 'inherit'});
	node.on('close', (code) => {
		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		}
	});
	done();
});

gulp.task('server-kill', (done) => {
	if (node) node.kill();
	done();
});

gulp.task('tsc', (done) => {
	if (tsc) tsc.kill();
	tsc = spawn('tsc', [], {stdio: 'inherit'});
	tsc.on('close', (code) => {
		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		} else {
			done();
		}
	});
});

const logsIndexHTML = `
<!DOCTYPE html>
<html>
	<head>
		<script type="application/javascript">
			function fitIframeHeight() {
				var iframe = document.querySelector('iframe');
				iframe.height = iframe.contentWindow.document.body.scrollHeight;
			};
		</script>
	</head>
	<body onload="fitIframeHeight()">
		<h1>Ng2NS Reports and Documentation Index</h1>
		<iframe src="git-stats.html" width="100%" frameborder=0></iframe>
		<div>
			<h2>Reports</h2>
			<ul>
				<li>
					<h3>Server Unit</h3>
					<ul>
						<li>
							<a href="unit/server/index.html" target=_blank>Spec</a>
						</li>
					</ul>
				</li>
				<li>
					<h3>Client Unit</h3>
					<ul>
						<li>
							<a href="unit/client/index.html" target=_blank>Spec</a>
						</li>
						<li>
							<a href="coverage/html-report/index.html" target=_blank>Coverage</a>
						</li>
					</ul>
				</li>
				<li>
					<h3>Client E2E</h3>
					<ul>
						<li>
							<a href="e2e/report/index.html" target=_blank>Spec</a>
						</li>
					</ul>
				</li>
			</li>
		</div>
		<div>
			<h2>Documentation</h2>
			<ul>
				<li>
					<h3>Server</h3>
					<ul>
						<li>
							<a href="jsdoc/index.html" target=_blank>JSDoc</a>
						</li>
					</ul>
				</li>
				<li>
					<h3>Client</h3>
					<ul>
						<li>
							<a href="typedoc/index.html" target=_blank>TypeDoc</a>
						</li>
					</ul>
				</li>
			</li>
		</div>
	</body>
</html>
`;
gulp.task('generate-logs-index', (done) => {
	fs.writeFile('./logs/index.html', logsIndexHTML, (err) => {
		if (err) throw err;
		console.log('# > LOGS index.html > was created');
		done();
	});
});

gulp.task('jsdoc-server', () => {
	const jsdoc = require('gulp-jsdoc3');
	const config = require('./jsdoc.json');
	const source = ['./server.js', './app/**/*.js'];
	return gulp.src(['README.md'].concat(source), {read: false})
		.pipe(jsdoc(config));
});

gulp.task('typedoc-client', () => {
	const typedoc = require('gulp-typedoc');
	const config = {
		// typescript options (see typescript docs)
		module: 'commonjs',
		target: 'es2015',
		moduleResolution: 'node',
		sourceMap: true,
		emitDecoratorMetadata: true,
		experimentalDecorators: true,
		removeComments: false,
		noImplicitAny: false,
		suppressImplicitAnyIndexErrors: true,
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
	};
	return gulp.src(['public/app/**/*.ts'], {read: false})
		.pipe(typedoc(config));
});

gulp.task('server-test', () => {
	return gulp.src(['./test/server/*.js'], { read: false })
		.pipe(mocha({ reporter: 'good-mocha-html-reporter' }))
		.on('error', util.log)
		.once('end', () => {
			if (fs.existsSync('./report.html')) {
				if (!fs.existsSync('./logs/unit/server')) {
					if (!fs.existsSync('./logs/unit')) {
						fs.mkdirSync('./logs/unit');
					}
					fs.mkdirSync('./logs/unit/server');
				}
				fs.copyFileSync('./report.html', './logs/unit/server/index.html');
				fs.unlinkSync('./report.html');
			}
		});
});

let karmaSRV;
gulp.task('client-unit-test', (done) => {
	if (!karmaSRV) {
		karmaSRV = new karmaServer({
			configFile: require('path').resolve('test/karma.conf.js'),
			singleRun: false,
			autoWatch: true
		});

		karmaSRV.on('browser_error', (browser, err) => {
			console.log('=====\nKarma > Run Failed\n=====\n', err);
			throw err;
		});

		karmaSRV.on('run_complete', (browsers, results) => {
			if (results.failed) {
				console.log('=====\nKarma > Tests Failed\n=====\n', results);
			} else {
				console.log('=====\nKarma > Complete With No Failures\n=====\n', results);
			}
			done();
		});

		karmaSRV.start();
	} else {
		console.log('<<<<< karmaSRV already running >>>>>');
		karmaSRV.refreshFiles();
	}
});

gulp.task('client-unit-test-single-run', (done) => {
	if (!karmaSRV) {
		karmaSRV = new karmaServer({
			configFile: require('path').resolve('test/karma.conf.js'),
			singleRun: true
		});

		karmaSRV.on('browser_error', (browser, err) => {
			console.log('=====\nKarma > Run Failed\n=====\n', err);
			throw err;
		});

		karmaSRV.on('run_complete', (browsers, results) => {
			if (results.failed) {
				console.log('=====\nKarma > Tests Failed\n=====\n', results);
			} else {
				console.log('=====\nKarma > Complete With No Failures\n=====\n', results);
			}
			done();
		});

		karmaSRV.start();
	} else {
		console.log('<<<<< karmaSRV already running >>>>>');
	}
});

gulp.task('client-e2e-test', () => {
	if (protractor) protractor.kill();
	protractor = spawn('npm', ['run', 'protractor'], {stdio: 'inherit'});
});

gulp.task('build-system-js', () => {
	/*
	*	this task builds angular application
	*	components, angular modules, and some dependencies
	*
	*	nonangular components related to design, styling, data visualization etc.
	*	are built by another task
	*/
	return systemjsBuilder('/','./systemjs.config.js')
		.buildStatic('app', 'bundle.min.js', {
			minify: true,
			mangle: true
		})
		.pipe(gulp.dest('./public/js'));
});

gulp.task('datamaps-rus-reference-and-worldTopo', () => {
	/*
	*
	*	fixes topo data
	* an incorrect an key for Russia map in datamaps.rus.js
	*	changes Datamap.prototype.rusTopo -> substring 'RUS' -> 'rus'
	*
	*	adds worldTopo json as a value to respective variable in datamaps.rus.js
	* replaces dummy string '__WORLD__' with json data from file worldTopo.json
	*/
	const worldTopoJSON = fs.readFileSync('./topoData/worldTopo.json', 'utf8').replace(/\n/, '');
	return gulp.src('./node_modules/datamaps/dist/datamaps.rus.js')
		.pipe(plumber())
		.pipe(replace(/RUS/g, (match, offset) => {
			console.log('Gulp replaced incorrect datamap key for Russia map, match', match, 'at offset', offset);
			return 'rus';
		}))
		.pipe(replace(/RU."/g, (match, offset) => {
			console.log('Gulp added code for Chukchi Autonomous Region in topo data for Russia, match', match, 'at offset', offset);
			return 'RU.CHUK"';
		}))
		.pipe(replace(/RU./g, (match, offset) => {
			console.log('Gulp replaced all dots between RU and region name for Russia, match', match, 'at offset', offset);
			return 'RU-';
		}))
		.pipe(replace(/RU-VO/, (match, offset) => {
			console.log('Gulp replaced erratic code for Arkhangel\'sk, for Russia map, match', match, 'at offset', offset);
			return 'RU-ARKH';
		}))
		.pipe(replace(/.__WORLD__./, (match, offset) => {
			console.log('Gulp replaced \'__WORLD__\' with worldTopo, match', match, 'at offset', offset);
			return worldTopoJSON;
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('./topoData/'));
});

gulp.task('pack-vendor-js', () => {
	return gulp.src([
		/*
		*	add paths to required third party js libraries here
		*/
		// angular requirements
		'./node_modules/core-js/client/shim.js',
		'./node_modules/zone.js/dist/zone.min.js',
		'./node_modules/reflect-metadata/Reflect.js',
		'./node_modules/web-animations-js/web-animations.min.js',

		'./node_modules/jquery/dist/jquery.js',

		// ng2nvd3 dependency
		'./node_modules/d3/d3.js',
		'./node_modules/nvd3/build/nv.d3.js',

		// datamaps depends on topojson
		'./node_modules/topojson/build/topojson.js',
		/*
		*	take edited and copied datamaps.rus.js instead of original
		*	see task: datamaps-rus-reference-and-worldTopo
		*/
		// './node_modules/datamaps/dist/datamaps.rus.js'
		'./topoData/datamaps.rus.js'
	])
		.pipe(plumber())
		.pipe(concat('vendor-bundle.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('vendor-bundle.min.js'))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('pack-vendor-css', () => {
	return gulp.src([
		/*
		*	add paths to required third party css files
		*/
		'./node_modules/nvd3/build/nv.d3.css',
		'./node_modules/components-font-awesome/css/fontawesome-all.css',
		/*
		*	Angular material theme should be chosen and loaded here
		*/
		'./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css'
		//'./node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
		//'./node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css'
		//'./node_modules/@angular/material/prebuilt-themes/purple-green.css'
	])
		.pipe(plumber())
		.pipe(concat('vendor-bundle.css'))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('vendor-bundle.min.css'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('move-vendor-fonts', () => {
	return gulp.src([
		'./node_modules/components-font-awesome/webfonts/*.*',
		// material design icons
		'./node_modules/material-design-icon-fonts/iconfont/*.eot',
		'./node_modules/material-design-icon-fonts/iconfont/*.woff2',
		'./node_modules/material-design-icon-fonts/iconfont/*.woff',
		'./node_modules/material-design-icon-fonts/iconfont/*.ttf'
	])
		.pipe(gulp.dest('./public/webfonts'));
});

gulp.task('sass-autoprefix-minify-css', () => {
	return gulp.src('./public/app/scss/*.scss')
		.pipe(plumber())
		.pipe(concat('packed-app.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('bundle.min.css'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('eslint', () => {
	return gulp.src(['./*.js', './app/**/*.js', './public/{electron.preload,service-worker}.js', './test/*.js', './test/e2e/scenarios.js', './test/server/test.js']) // uses ignore list from .eslintignore
		.pipe(eslint('./.eslintrc.json'))
		.pipe(eslint.format());
});

gulp.task('tslint', () => {
	return gulp.src(['./public/app/*.ts', './public/app/**/*.ts', '!./public/app/{scss,views}/', './test/client/**/*.ts'])
		.pipe(tslint({
			formatter: 'verbose' // 'verbose' - extended info | 'prose' - brief info
		}))
		.pipe(tslint.report({
			emitError: false
		}));
});

gulp.task('lint', (done) => {
	runSequence('eslint', 'tslint', done);
});

/*
*	watchers
*/
gulp.task('watch', () => {
	gulp.watch(['./server.js', './app/**/*.js'], ['server']); // watch server and database changes, and restart server
	gulp.watch(['./test/server/*.js'], ['server-test']); // watch server tests changes, and run tests
	gulp.watch(['./gulpfile.js'], ['pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts']); // watch gulpfile changes, and repack vendor assets
	gulp.watch('./public/app/scss/*.scss', ['sass-autoprefix-minify-css']); // watch app scss-source changes, and pack application css bundle
	gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/**/*.ts', './tslint.json'], ['rebuild-app']); // watch app ts-source chages, and rebuild app js bundle
	gulp.watch(['./*.js', './app/**/*.js', './public/{electron.preload,service-worker}.js', './test/*.js', './test/e2e/scenarios.js', './test/server/test.js', './.eslintignore', './.eslintrc.json'], ['eslint']); // watch js file changes, and lint
});

gulp.task('watch-and-lint', () => {
	gulp.watch(['./*.js', './app/**/*.js', './public/{electron.preload,service-worker}.js', './test/*.js', './test/e2e/scenarios.js', './test/server/test.js', './.eslintignore', './.eslintrc.json'], ['eslint']); // watch js file changes, and lint
	gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/**/*.ts', './tslint.json'], ['tslint']); // watch ts files and lint on change
});

gulp.task('watch-client-and-test', () => {
	gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/**/*.ts'], ['compile-and-test']); // watch app source changes, and compile and test
	gulp.watch(['./test/karma.conf.js','./test/karma.test-shim.js'], ['client-unit-test']); // watch karma configs changes, and test
});

/*
*	test sequences
*/
gulp.task('compile-and-test', (done) => {
	runSequence('tsc', 'client-unit-test', done);
});

/*
*	build sequences
*/
gulp.task('compile-and-build', (done) => {
	runSequence('tsc', 'build-system-js', 'datamaps-rus-reference-and-worldTopo', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', 'sass-autoprefix-minify-css', 'hashsum', done);
});

gulp.task('build', (done) => {
	runSequence('build-system-js', 'datamaps-rus-reference-and-worldTopo', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', 'sass-autoprefix-minify-css', 'hashsum', done);
});

gulp.task('rebuild-app', (done) => { // should be used in watcher to rebuild the app on *.ts file changes
	runSequence('tslint', 'tsc', 'build-system-js', 'hashsum', done);
});

/*
*	start sequences
*/
gulp.task('default', (done) => {
	runSequence('lint', 'compile-and-build', 'create-env-development', 'server', 'watch', done);
});

gulp.task('production-start', (done) => {
	runSequence('compile-and-build', 'create-env-production', 'server', done);
});

/*
*	build electron app dist for windows, linux
*
*	requires mono installation for Ubuntu, see here http://www.mono-project.com/download/
*
*	NOTE before packing/building: package.json must contain
*	{...
*		"main": "main.js",
*	...}
*
*	after installation execute: gulp electron-packager-win
*
*	after previous task is completed execute: gulp electron-winstaller
*	or use a single sequence of tasks, execure: gulp build-electron-win
*
*	when running on windows port 8080 may be in use, execute the following:
*	netstat -ano | findstr 8080
*	taskkill /F /PID <fond_task_PID>
*
*	electronPackagerIgnore is an array of regexps to be ignored on electron app packaging
*/
const electronPackagerIgnore = [ // exclude
	/\/desktop/, // builds and dists
	/\/public\/app\/(components|directives|scss|services|translate|.*\.ts|.*\.js)/, // client app source code
	/\/logs/, // logs
	/\/node_modules\/(@angular|gulp.*|karma.*|jasmine.*|mocha.*|@types|(remap-)?istanbul)/, // not needed node_modules
	/\/test\/(client|e2e|server\/.*\.js|.*\.js)/, // tests source code
	/\/topoData/, // intermediary project build files
	/\/Dockerfile\.*/, // docker configs
	/\/\.(dockerignore|editorconfig|eslintignore|eslintrc\.json|gitattributes|gitignore)/, // configuration files matching pattern: .config_filename
	/\/(tsconfig|tslint|jsdoc)\.json/, // json configuration
	/\/README\.md/, // readme
	/\/.*\.sh/, // bash scripts
	/\/systemjs\..*/ // systemjs configs
	// /\/package(-lock)?\.json/ // package.json and package-lock.json
];
gulp.task('electron-packager-win', (done) => {
	const electronPackager = require('electron-packager');
	electronPackager({
		dir: './',
		out: './desktop/win/build',
		ignore: electronPackagerIgnore,
		overwrite: true,
		asar: true,
		arch: 'x64',
		platform: 'win32',
		win32metadata: {
			'requested-execution-level': 'requireAdministrator' // asInvoker, hightstAvailable, requireAdministrator
		}
	}).then(
		(appPaths) => {
			console.log(`package successful, appPaths ${appPaths}`);
			done();
		},
		(error) => {
			console.log(`error packaging electron app ${error}`);
			throw error;
		}
	);
});
gulp.task('electron-packager-nix', (done) => {
	const electronPackager = require('electron-packager');
	electronPackager({
		dir: './',
		out: './desktop/nix/build',
		ignore: electronPackagerIgnore,
		overwrite: true,
		asar: true,
		arch: 'x64',
		platform: 'linux'
	}).then(
		(appPaths) => {
			console.log(`package successful, appPaths ${appPaths}`);
			done();
		},
		(error) => {
			console.log(`error packaging electron app ${error}`);
			throw error;
		}
	);
});
gulp.task('electron-winstaller', (done) => {
	const electronWinstaller = require('electron-winstaller');
	electronWinstaller.createWindowsInstaller({
		appDirectory: './desktop/win/build/ng2nwtn-win32-x64',
		outputDirectory: './desktop/win/dist',
		authors: 'TechnoNIKOL'
	}).then(
		() => {
			console.log('build successful');
			done();
		},
		(error) => {
			console.log(`error building electron app for windows ${error}`);
			throw error;
		}
	);
});
gulp.task('electron-debinstaller', (done) => {
	const electronDebInstaller = require('electron-installer-debian');
	electronDebInstaller({
		src: './desktop/nix/build/ng2nwtn-linux-x64',
		dest: './desktop/nix/dist',
		maintainer: 'TechnoNIKOL',
		arch: 'amd64',
		categories: ['Internet'],
		lintianOverrides: ['changelog-file-missing-in-native-package']
	}, (error, options) => {
		if (error) {
			console.log(`error building electron app for debian ${error}`);
			throw error;
		}
		console.log(`successful build with options ${options}`);
		done();
	});
});
gulp.task('build-electron-win', (done) => {
	runSequence('compile-and-build', 'create-env-electron', 'electron-packager-win', 'electron-winstaller', done);
});
gulp.task('build-electron-deb', (done) => {
	runSequence('compile-and-build', 'create-env-electron', 'electron-packager-nix', 'electron-debinstaller', done);
});

process.on('exit', () => {
	if (node) node.kill();
});

process.on('SIGINT', () => {
	killProcessByName('gulp');
});
