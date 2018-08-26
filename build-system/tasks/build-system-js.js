/**
 * Build SystemJS task module
 * @module build-system/tasks/build-system-js
 * @see {@link module:gulpfile}
 * @summary Builds application for specific roles using SystemJS.
 * @description Bundles scripts for application built for designated role.
 */

/**
 * Builds application for designated role using SystemJS.
 */
module.exports = {

	/**
	 * Builds angular vendor pack.
	 * @param {Object} gulp Gulp
	 * @param {Function} systemjsBuilder Gulp SystemJS builder
	 * @param {Object} config systemjs config exported from require('./build-system/config').systemjs
	 */
	dependencies: (gulp, systemjsBuilder, config) => {
		return systemjsBuilder(config.baseDir, config.builderConfig)
		.bundle('./public/app/**/*.js - [./public/app/**/*.js]', config.dependenciesBundleName, config.builderOptions)
		.pipe(gulp.dest(config.gulp.dest));
	},

	/**
	 * Builds application lazy bundle.
	 * @param {Object} gulp Gulp
	 * @param {Function} systemjsBuilder Gulp SystemJS builder
	 * @param {Object} config systemjs config exported from require('./build-system/config').systemjs
	 */
	lazy: (gulp, systemjsBuilder, config) => {
		return systemjsBuilder(config.baseDir, config.builderConfig)
		.bundle(`./public/app/lazy/lazy.module.js - ./public/js/${config.dependenciesBundleName}`, config.lazyBundleName, config.builderOptions)
		.pipe(gulp.dest(config.gulp.dest));
	},

	/**
	 * Builds application eager bundle.
	 * @param {Object} gulp Gulp
	 * @param {Function} systemjsBuilder Gulp SystemJS builder
	 * @param {Object} config systemjs config exported from require('./build-system/config').systemjs
	 */
	app: (gulp, systemjsBuilder, config) => {
		return systemjsBuilder(config.baseDir, config.builderConfig)
		.bundle(`${config.moduleName} - ./public/js/${config.dependenciesBundleName} - ./public/js/${config.lazyBundleName}`, config.lazyBundleName, config.builderOptions)
		.pipe(gulp.dest(config.gulp.dest));
	},

};
