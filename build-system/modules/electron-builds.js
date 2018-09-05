/**
 * Electron builds module
 * @module build-system/modules/electron-builds
 * @see {@link module:gulpfile}
 * @summary Gulp tasks for electron distributions building.
 * @description Gulp tasks for electron distributions building.
 */

/**
 * Gulp tasks for electron distributions building.
 * @param {Object} gulp Gulp
 * @param {Function} runSequence Run sequence for gulp
 */
module.exports = (gulp, runSequence, exec, cwd) => {

	/*
	* Electron application building.
	*
	* requires mono installation for Ubuntu, see here http://www.mono-project.com/download/
	*
	* NOTE before packing/building: package.json must contain
	* {...
	*  "main": "main.js",
	* ...}
	*
	* after installation execute: gulp electron-packager-win
	*
	* after previous task is completed execute: gulp electron-winstaller
	*
	* or use a single sequence of tasks, execure: gulp build-electron-win
	*
	* NOTE: considering using electron-forge to build the app? don't, it it really sucks
	*
	* when running on windows port 8080 may be in use, execute the following:
	* netstat -ano | findstr 8080
	* taskkill /F /PID <fond_task_PID>
	*
	* to be able to run electron on windows the following packages are required
	* - https://www.microsoft.com/en-us/download/confirmation.aspx?id=48145
	*
	* electronPackagerIgnore contains array of regexps that should be ignored when packaging electron application
	*
	*/

	/**
	 * @name electronPackagerIgnore
	 * @constant
	 * @summary array of regexps to be ignored on electron app packaging.
	 */
	const electronPackagerIgnore = [ // exclude
		/\/desktop/, // builds and dists
		/\/build-system/, // build system tasks
		/\/ci/, // dockerfiles, related shell scripts
		/\/logs/, // logs
		/\/node_modules\/(@angular|gulp.*|karma.*|jasmine.*|mocha.*|@types|(remap-)?istanbul)/, // not needed node_modules
		/\/public\/app\/(components|directives|interfaces|pipes|scss|services|.*\.ts|.*\.js)/, // client app source code
		/\/test\/(client|e2e|server\/.*\.js|.*\.js)/, // tests source code
		/\/Jenkinsfile/, // jenkins configs
		/\/\.(dockerignore|editorconfig|eslintignore|eslintrc\.json|gitignore)/, // configuration files matching pattern: .config_filename
		/\/(tsconfig|tslint|jsdoc.*)\.json/, // json configuration
		/\/README\.md/, // readme
		/\/NG2NS_LICENCE/, // readme
		/\/.*\.sh/, // bash scripts
		/\/systemjs\..*\.js/ // systemjs configs
		// /\/package(-lock)?\.json/ // package.json and package-lock.json
	];

	/**
	 * @name getCurrentElectronVersion
	 * @member {Function}
	 * @summary returns currently installed electron version
	 */
	function getCurrentElectronVersion() {
		return new Promise((resolve, reject) => {
			exec('echo "$(./node_modules/electron/dist/electron -v)"', (err, stdout, stderr) => {
				if (err) {
					reject(err);
				}
				if (stderr) {
					reject(stderr);
				}
				console.log('stdout', stdout);
				resolve(stdout.match(/\d+\.\d+\.\d+/)[0]);
			});
		});
	}

	/**
	 * @name electron-packager-win
	 * @member {Function}
	 * @summary Packs electron application: windows.
	 * @description Packs electron application for a specific platform: windows.
	 * @see {@link module:build-system/tasks/electron-packager}
	 */
	gulp.task('electron-packager-win', (done) => {
		const electronPackager = require('electron-packager');
		getCurrentElectronVersion()
			.then((version) => {
				console.log(`current electron version ${version}`);
				const packagerOptions = {
					dir: `${cwd}/`,
					out: `${cwd}/desktop/win/build`,
					ignore: electronPackagerIgnore,
					electronVersion: version, // this param is required when placing electron in package's optional dependencies
					overwrite: true,
					asar: true,
					arch: 'x64',
					platform: 'win32',
					win32metadata: {
						'requested-execution-level': 'asInvoker' // asInvoker, hightstAvailable, requireAdministrator
					}
				};
				return require(`${cwd}/build-system/tasks/electron-packager`)(electronPackager, packagerOptions, done);
			})
			.catch((error) => {
				throw error;
			});
	});

	/**
	 * @name electron-packager-nix
	 * @member {Function}
	 * @summary Packs electron application for linux.
	 * @description Packs electron application for a specific platform: linux.
	 * @see {@link module:build-system/tasks/electron-packager}
	 */
	gulp.task('electron-packager-nix', (done) => {
		const electronPackager = require('electron-packager');
		getCurrentElectronVersion()
			.then((version) => {
				console.log(`current electron version ${version}`);
				const packagerOptions = {
					dir: `${cwd}/`,
					out: `${cwd}/desktop/nix/build`,
					ignore: electronPackagerIgnore,
					electronVersion: version, // this param is required when placing electron in package's optional dependencies
					overwrite: true,
					asar: true,
					arch: 'x64',
					platform: 'linux'
				};
				return require(`${cwd}/build-system/tasks/electron-packager`)(electronPackager, packagerOptions, done);
			})
			.catch((error) => {
				throw error;
			});
	});

	/**
	 * @name electron-packager-osx
	 * @member {Function}
	 * @summary Packs electron application for osx.
	 * @description Packs electron application for a specific platform: osx.
	 * @see {@link module:build-system/tasks/electron-packager}
	 */
	gulp.task('electron-packager-osx', (done) => {
		const electronPackager = require('electron-packager');
		getCurrentElectronVersion()
			.then((version) => {
				console.log(`current electron version ${version}`);
				const packagerOptions = {
					dir: `${cwd}/`,
					out: `${cwd}/desktop/osx/build`,
					ignore: electronPackagerIgnore,
					electronVersion: version, // this param is required when placing electron in package's optional dependencies
					overwrite: true,
					asar: true,
					arch: 'x64',
					platform: 'darwin',
					appCategoryType: 'public.app-category.business'
				};
				return require(`${cwd}/build-system/tasks/electron-packager`)(electronPackager, packagerOptions, done);
			})
			.catch((error) => {
				throw error;
			});
	});

	/**
	 * @name electron-winstaller
	 * @member {Function}
	 * @summary Creates electron installer for windows, requires prebuilt application with electron packager.
	 * @description Creates electron installer for windows, requires prebuilt application with electron packager.
	 * @see {@link module:build-system/tasks/electron-installer}
	 */
	gulp.task('electron-winstaller', (done) => {
		const electronWinstaller = require('electron-winstaller');
		const installerOptions = {
			appDirectory: `${cwd}/desktop/win/build/transport-win32-x64`,
			outputDirectory: `${cwd}/desktop/win/dist`,
			authors: 'Transport'
		};
		return require(`${cwd}/build-system/tasks/electron-installer`)(electronWinstaller, installerOptions, 'win', done);
	});

	/**
	 * @name electron-debinstaller
	 * @member {Function}
	 * @summary Creates electron installer for debian linux, requires prebuilt application with electron packager.
	 * @description Creates electron installer for debian linux, requires prebuilt application with electron packager.
	 * @see {@link module:build-system/tasks/electron-installer}
	 */
	gulp.task('electron-debinstaller', (done) => {
		const electronDebInstaller = require('electron-installer-debian');
		const installerOptions = {
			src: `${cwd}/desktop/nix/build/transport-linux-x64`,
			dest: `${cwd}/desktop/nix/dist`,
			maintainer: 'Transport',
			arch: 'amd64',
			categories: ['Internet'],
			lintianOverrides: ['changelog-file-missing-in-native-package']
		};
		return require(`${cwd}/build-system/tasks/electron-installer`)(electronDebInstaller, installerOptions, 'deb', done);
	});

	/**
	 * @name electron-dmginstaller
	 * @member {Function}
	 * @summary Creates electron installer for osx, requires prebuilt application with electron packager.
	 * @description Creates electron installer for osx, requires prebuilt application with electron packager.
	 * @see {@link module:build-system/tasks/electron-installer}
	 */
	gulp.task('electron-dmginstaller', (done) => {
		const electronDmgInstaller = require('electron-installer-dmg');
		const installerOptions = {
			src: `${cwd}/desktop/osx/build/transport-darwin-x64`,
			dest: `${cwd}/desktop/osx/dist`,
			maintainer: 'Transport',
			arch: 'amd64',
			categories: ['Internet'],
			lintianOverrides: ['changelog-file-missing-in-native-package']
		};
		return require(`${cwd}/build-system/tasks/electron-installer`)(electronDmgInstaller, installerOptions, 'osx', done);
	});

	/**
	 * @name build-electron-win
	 * @member {Function}
	 * @summary Builds electron application for windows.
	 * @description Builds electron application for windows: packages (creates portable build), creates installer.
	 * @see {@link module:build-system/tasks/electron-installer}
	 */
	gulp.task('build-electron-win', (done) => {
		runSequence('create-env-electron', 'electron-packager-win', 'electron-winstaller', done);
	});

	/**
	 * @name build-electron-deb
	 * @member {Function}
	 * @summary Builds electron application for debian linux.
	 * @description Builds electron application for debian linux: packages (creates portable build), creates installer.
	 * @see {@link module:build-system/tasks/electron-installer}
	 */
	gulp.task('build-electron-deb', (done) => {
		runSequence('create-env-electron', 'electron-packager-nix', 'electron-debinstaller', done);
	});

	/**
	 * @name build-electron-osx
	 * @member {Function}
	 * @summary Builds electron application for osx.
	 * @description Builds electron application for osx: packages (creates portable build), creates installer.
	 * @see {@link module:build-system/tasks/electron-installer}
	 */
	gulp.task('build-electron-osx', (done) => {
		runSequence('create-env-electron', 'electron-packager-osx', 'electron-dmginstaller', done);
	});
};
