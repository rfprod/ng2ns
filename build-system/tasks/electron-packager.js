/**
 * Electron packager task module
 * @module build-system/tasks/electron-packager
 * @see {@link module:gulpfile}
 * @summary Packs electron application.
 * @description Packs electron application for a specific platform (nix, win, osx).
 */

/**
 * Packs electron application.
 * @param {Function} electronPackager Electron packager
 * @param {Object} packagerOptions Electron packager options
 * @param {Function} done done function
 */
module.exports = (electronPackager, packagerOptions, done) => {
	electronPackager(packagerOptions).then(
		(appPaths) => {
			console.log(`package successful, appPaths ${appPaths}`);
			done();
		},
		(error) => {
			console.log(`error packaging electron app ${error}`);
			throw error;
		}
	);
};
