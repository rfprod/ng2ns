/**
 * Electron installer task module
 * @module build-system/tasks/electron-installer
 * @see {@link module:gulpfile}
 * @see {@link module:build-system/tasks/electron-packager}
 * @summary Creates electron installer, requires prebuilt application with electron packager.
 * @description Creates electron installer for a specific platform (nix, win, osx), requires prebuilt application with electron packager.
 */

/**
 * Packs electron application.
 * @param {Function} electronInstaller Electron installer for specific platform.
 * @param {Object} installerOptions Electron installer options
 * @param {'win'|'deb'|'osx'} platform win|deb|osx - platform for which the application is built
 * @param {Function} done done function
 */
module.exports = (electronInstaller, installerOptions, platform, done) => {
	if (platform === 'win') {
		electronInstaller(installerOptions).then(
			(appPaths) => {
				console.log(`successfully created electron installer for windows, appPaths ${appPaths}`);
				done();
			},
			(error) => {
				console.log(`error creating electron installer for windows ${error}`);
				throw error;
			}
		);
	} else if (platform === 'deb') {
		electronInstaller(installerOptions, (error, options) => {
			if (error) {
				console.log(`error creating electron installer for debian ${error}`);
				throw error;
			}
			console.log(`successfully created electron installer for debian with options ${options}`);
			done();
		});
	} else if (platform === 'osx') {
		electronInstaller(installerOptions, (error, options) => {
			if (error) {
				console.log(`error creating electron installer for debian ${error}`);
				throw error;
			}
			console.log(`successfully created electron installer for debian with options ${options}`);
			done();
		});
	} else {
		throw new Error(`electron-installer: wrong platrofm value ${platform}`);
	}
};
