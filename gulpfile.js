'use strict';

const gulp = require('gulp'),
	runSequence = require('run-sequence'),
	util = require('gulp-util'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	eslint = require('gulp-eslint'),
	tslint = require('gulp-tslint'),
	plumber = require('gulp-plumber'),
	mocha = require('gulp-mocha'),
	karmaServer = require('karma').Server,
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	autoprefixer = require('gulp-autoprefixer'),
	systemjsBuilder = require('gulp-systemjs-builder'),
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

function createEnvFile(env, done) {
	fs.writeFile('./.env', env, (err) => {
		if (err) throw err;
		console.log('# > ENV > .env file was created');
		done();
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

gulp.task('tsc', (done) => {
	if (node) tsc.kill();
	tsc = spawn('tsc', [], {stdio: 'inherit'});
	tsc.on('close', (code) => {
		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		} else {
			done();
		}
	});
});

gulp.task('server-test', () => {
	return gulp.src(['./test/server/*.js'], { read: false })
		.pipe(mocha({ reporter: 'spec' }))
		.on('error', util.log);
});

gulp.task('client-unit-test', (done) => {
	const server = new karmaServer({
		configFile: require('path').resolve('test/karma.conf.js'),
		singleRun: false
	});

	server.on('browser_error', (browser, err) => {
		console.log('=====\nKarma > Run Failed\n=====\n', err);
		throw err;
	});

	server.on('run_complete', (browsers, results) => {
		if (results.failed) {
			throw new Error('=====\nKarma > Tests Failed\n=====\n', results);
		}
		console.log('=====\nKarma > Complete With No Failures\n=====\n', results);
		done();
	});

	server.start();
});

gulp.task('client-unit-test-single-run', (done) => {
	const server = new karmaServer({
		configFile: require('path').resolve('test/karma.conf.js'),
		singleRun: true
	});

	server.on('browser_error', (browser, err) => {
		console.log('=====\nKarma > Run Failed\n=====\n', err);
		throw err;
	});

	server.on('run_complete', (browsers, results) => {
		if (results.failed) {
			// throw new Error('=====\nKarma > Tests Failed\n=====\n', results);
			console.log('=====\nKarma > Tests Failed\n=====\n', results);
		} else {
			console.log('=====\nKarma > Complete With No Failures\n=====\n', results);
		}
		done();
	});

	server.start();
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

gulp.task('pack-vendor-js', () => {
	/*
	*	nonangular js bundle
	*	components related to design, styling, data visualization etc.
	*/
	return gulp.src([
		/*
		*	add paths to required third party js files
		*
		*	note: sequence is essential
		*/

		// angular requirements
		'./node_modules/core-js/client/shim.js',
		'./node_modules/zone.js/dist/zone.min.js',
		'./node_modules/reflect-metadata/Reflect.js',
		'./node-modules/web-animations-js/web-animations.min.js',

		'./node_modules/jquery/dist/jquery.js',

		// angular dependency
		'./node_modules/d3/d3.js',
		'./node_modules/nvd3/build/nv.d3.js'
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
		'./node_modules/nvd3/build/nv.d3.css',
		'./node_modules/components-font-awesome/css/font-awesome.css',
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
		'./node_modules/components-font-awesome/fonts/*.*',
		// material design icons
		'./node_modules/material-design-icon-fonts/iconfont/*.eot',
		'./node_modules/material-design-icon-fonts/iconfont/*.woff2',
		'./node_modules/material-design-icon-fonts/iconfont/*.woff',
		'./node_modules/material-design-icon-fonts/iconfont/*.ttf'
	])
		.pipe(gulp.dest('./public/fonts'));
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
	return gulp.src(['./app/**', './public/js/*.js', './*.js']) // uses ignore list from .eslintignore
		.pipe(eslint('./.eslintrc.json'))
		.pipe(eslint.format());
});

gulp.task('tslint', () => {
	return gulp.src(['./public/app/*.ts', './public/app/**/*.ts'])
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
	gulp.watch(['./server.js', './app/**/*.js'], ['server']); // watch server and changes and restart server
	gulp.watch(['./public/app/*.js', './public/app/**/*.js'], ['build-system-js']); // watch app js changes and build system
	gulp.watch('./public/app/scss/*.scss', ['sass-autoprefix-minify-css']); // watch scss changes and process
	gulp.watch(['./test/server/*.js'], ['server-test']); // watch server tests changes and run tests
	gulp.watch(['./app/**/*.js', './*.js', './.eslintignore', './.eslintrc.json'], ['eslint']); // watch js files and lint on change
	gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/*.ts', './tslint.json'], ['tslint']); // watch ts files and lint on change
});

gulp.task('watch-and-lint', () => {
	gulp.watch(['./app/**/*.js', './*.js', './.eslintignore', './.eslintrc.json'], ['eslint']); // watch js files and lint on change
	gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/*.ts', './tslint.json'], ['tslint']); // watch ts files and lint on change
});

gulp.task('watch-client-and-test', () => {
	gulp.watch(['./public/app/*.ts','./test/client/**/*.ts'], ['tsc']); // watch unit test changes and run tests
	gulp.watch(['./public/app/*.js','./test/client/**/*.js','./test/karma.conf.js','./test/karma.test-shim.js'], ['client-unit-test']); //watch unit test changes and run tests
});

/*
*	build sequences
*/
gulp.task('compile-and-build', (done) => {
	runSequence('tsc', 'build-system-js', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', 'sass-autoprefix-minify-css', done);
});

gulp.task('build', (done) => {
	runSequence('build-system-js', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', 'sass-autoprefix-minify-css', done);
});

/*
*	start sequences
*/
gulp.task('default', (done) => {
	runSequence('create-env-development', 'server', 'build', 'lint', 'watch', done);
});

gulp.task('production-start', (done) => {
	runSequence('create-env-production', 'server', 'build', done);
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
	runSequence('create-env-electron', 'electron-packager-win', 'electron-winstaller', done);
});
gulp.task('build-electron-deb', (done) => {
	runSequence('create-env-electron', 'electron-packager-nix', 'electron-debinstaller', done);
});

process.on('exit', () => {
	if (node) node.kill();
});

process.on('SIGINT', () => {
	killProcessByName('gulp');
});
