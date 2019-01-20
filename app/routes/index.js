'use strict';

/**
 * Server Routes module
 * @module app/routes/index
 * @param {object} app Express application
 * @param {String} cwd Current working directory
 * @param {object} fs Filesystem access module
 * @param {object} SrvInfo Server information
 * @param {object} DBmocks Database mocks
 */
module.exports = function(app, cwd, fs, SrvInfo, DBmocks) {

	/**
	 * Common request handlers with firebase functions.
	 */
	const handlers = require('../../functions/handlers/index')(cwd, fs, SrvInfo, DBmocks, false);

	/**
	 * Serves Application root (index page).
	 * @name /
	 * @path {GET} /
	 * @code {200}
	 * @response {html} index.html Application index file
	 */
	app.get('/', (req, res) => {
		res.sendFile(cwd + '/public/index.html', {
			headers: {
				'Views': req.session.views
			}
		});
	});

	/**
	 * Serves service worker on root path to capture root scope
	 * @name /service-worker.js
	 * @path {GET} /service-worker.js
	 * @code {200}
	 * @response {js} service-worker.js Service worker
	 */
	app.get('/service-worker.js', (req, res) => {
		res.sendFile(cwd + '/public/service-worker.js');
	});

	/**
	 * Returns application build hashsum from .env file.
	 * Is used by service worker when caching.
	 * @name /api/app-diag/hashsum
	 * @path {GET} /api/app-diag/hashsum
	 * @code {200}
	 * @response {object} - Object with hashsum key
	 */
	app.get('/api/app-diag/hashsum', (req, res) => {
		handlers.hashsum(req, res);
	});

	/**
	 * Returns user sessions codes list with views count.
	 * This endpoint is used for d3 chart demonstration purposes.
	 * @name /api/app-diag/usage
	 * @path {GET} /api/app-diag/usage
	 * @code {200}
	 * @response {array} - Array of objects with user sessions data
	 */
	app.get('/api/app-diag/usage', (req, res) => {
		handlers.usage(req, res);
	});

	/**
	 * Returns static server diagnostic data.
	 * @name /api/app-diag/static
	 * @path {GET} /api/app-diag/static
	 * @code {200}
	 * @response {object} - Server static data
	 */
	app.get('/api/app-diag/static', (req, res) => {
		handlers.static(req, res);
	});

	/**
	 * Returns dynamic server diagnostic data.
	 * @name /api/app-diag/dynamic
	 * @path {WS} /api/app-diag/dynamic
	 * @code {200}
	 * @response {array} - Server dynamic data
	 */
	app.ws('/api/app-diag/dynamic', (ws) => {
		handlers.dynamic(ws);
	});

	/**
	 * Returns mocked users list.
	 * @name /api/users
	 * @path {GET} /api/users
	 * @code {200}
	 * @response {array} - Array of objects
	 */
	app.get('/api/users', (req, res) => {
		handlers.users(req, res);
	});
};
