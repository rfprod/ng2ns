/**
 * Watch task module
 * @module build-system/tasks/watch
 * @see {@link module:gulpfile}
 * @summary Watches project files, and triggers respective tasks.
 * @description Watches project files, and triggers respective tasks on file changes.
 */

module.exports = {
	/**
	 * Watches all files, triggers all tasks - default development mode.
	 * @param {Object} gulp Gulp
	 */
	all: (gulp) => {
		// watch server and database changes, and restart server
		gulp.watch(['./server.js', './app/**/*.js'])
			.on('change', () => {
				gulp.series(['server']);
			});
		// watch server tests changes, and run tests
		gulp.watch(['./test/server/*.js'])
			.on('change', () => {
				gulp.series(['server-test']);
			});
		// watch gulpfile changes, and repack vendor assets
		gulp.watch(['./gulpfile.js'])
			.on('change', () => {
				gulp.series(['pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts']);
			});
		// watch app scss-source changes, and pack application css bundle
		gulp.watch('./public/app/scss/*.scss')
			.on('change', () => {
				gulp.series(['sass-autoprefix-minify-css']);
			});
		// watch app ts-source chages, and rebuild app js bundle
		gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/**/*.ts', './tslint.json'])
			.on('change', () => {
				gulp.series(['spawn-rebuild-app']);
			});
		// watch js file changes, and lint
		gulp.watch(['./*.js', './app/**/*.js', './public/{electron.preload,service-worker}.js', './test/*.js', './test/e2e/scenarios.js', './test/server/test.js', './.eslintignore', './.eslintrc.json'])
			.on('change', () => {
				gulp.series(['eslint']);
			});
	},

	/**
	 * Watches js/ts files and lints them.
	 * @param {Object} gulp Gulp
	 */
	lint: (gulp) => {
		// watch js file changes, and lint
		gulp.watch(['./*.js', './app/**/*.js', './public/{electron.preload,service-worker}.js', './test/*.js', './test/e2e/scenarios.js', './test/server/test.js', './.eslintignore', './.eslintrc.json'])
			.on('change', () => {
				gulp.series(['eslint']);
			});
		// watch ts files and lint on change
		gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/**/*.ts', './tslint.json'])
			.on('change', () => {
				gulp.series(['tslint']);
			});
	},

	/**
	 * Watches client files and executes tests.
	 * @param {Object} gulp Gulp
	 */
	test: (gulp) => {
		// watch app source changes, and compile and test
		gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/**/*.ts'])
			.on('change', () => {
				gulp.series(['compile-and-test']);
			});
		// watch karma configs changes, and test
		gulp.watch(['./test/karma.conf.js','./test/karma.test-shim.js'])
			.on('change', () => {
				gulp.series(['client-unit-test']);
			});
	}
};
