/**
 * Server module
 * @module build-system/modules/server
 * @see {@link module:gulpfile}
 * @summary Server handling tasks.
 * @description Client application server handling tasks.
 */

/**
 * @member {Function}
 * @summary Kills process by name.
 */
function killProcessByName(exec, name) {
	exec('pgrep ' + name, (error, stdout, stderr) => {
		if (error) {
			console.log('killProcessByName, error', error);
		}
		if (stderr) console.log('stderr:', stderr);
		if (stdout) {
			const runningProcessesIDs = stdout.match(/\d{3,}/);
			runningProcessesIDs.forEach((id) => {
				exec('kill ' + id, (error, stdout, stderr) => {
					if (error) throw error;
					if (stderr) console.log('stdout:', stdout);
					if (stdout) console.log('stderr:', stderr);
				});
			});
		}
	});
}

/**
 * Server handling tasks.
 * @param {Object} gulp Gulp
 * @param {Object} node NodeJS server instance
 * @param {Object} exec NodeJS child process executor
 * @param {Object} spawn NodeJS child process spawner
 */
module.exports = (gulp, node, exec, spawn) => {
	/**
	 * @name server
	 * @member {Function}
	 * @summary Starts application server.
	 * @description Starts client application server.
	 */
	gulp.task('server', (done) => {
		if (node) node.kill();
		node = spawn('node', ['server.js'], {stdio: 'inherit'});
		node.on('close', (code) => {
			if (code === 8) {
				console.log('Error detected, waiting for changes...');
			}
		});
		done();
	});

	/**
	 * @name server-kill
	 * @member {Function}
	 * @summary Kills application server.
	 * @description Kills client application server.
	 */
	gulp.task('server-kill', (done) => {
		if (node) node.kill();
		killProcessByName(exec, 'ng2nodestarter');
		done();
	});
};
