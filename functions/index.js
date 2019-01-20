const functions = require('firebase-functions');
const admin = require('firebase-admin');

/*
*	Create and Deploy Cloud Functions
*	https://firebase.google.com/docs/functions/write-firebase-functions
*
*	basic usage example
*
* exports.helloWorld = functions.https.onRequest((request, response) => {
*		response.send('Hello from Firebase!');
*	});
*/

/**
 * Initialize admin SDK to access Firebase Realtime Database.
 */
admin.initializeApp(functions.config().firebase);

/**
 * @name cwd
 * @constant
 * @summary Current directory of the main Server script - server.js
 * @description Correct root path for all setups, it should be used for all file references for the server and its modules like filePath: cwd + '/actual/file.extension'. Built Electron app contains actual app in resources/app(.asar) subdirectory, so it is essential to prefer __dirname usage over process.cwd() to get the value.
 */
const cwd = __dirname;
/**
 * @name path
 * @constant
 * @summary Directory paths utility module
 * @description Directory paths utility module
 */
const fs = require('fs');
/**
 * @name SrvInfo
 * @constant
 * @summary Server information module
 * @description Static, and dynamic server data
 * @see {@link module:app/utils/srv-info}
 */
const SrvInfo = require('./utils/srv-info.js');
/**
 * @name DBmocks
 * @constant
 * @summary Databse mocks module
 * @description Databse mocks module containing functions that return generated data
 * @see {@link module:app/mocks/users}
 */
const DBmocks = {
	users: require('./models/users').users()
};

/**
 * Http requests handlers.
 */
const handlers = require('./handlers/index.js')(cwd, fs, SrvInfo, DBmocks, true);

/**
 * Client application build hashsum.
 */
exports.hashsum = functions.https.onRequest((req, res) => {
	if (req.method !== 'GET') {
		res.status(403).json({error: 'Forbidden method'});
	}
	req.url = '/api/app-diag/hashsum';
	return handlers.hashsum(req, res);
});

/**
 * Client application usage stats.
 */
exports.usage = functions.https.onRequest((req, res) => {
	if (req.method !== 'GET') {
		res.status(403).json({error: 'Forbidden method'});
	}
	req.url = '/api/app-diag/usage';
	return handlers.usage(req, res);
});

/**
 * Client application server static data.
 */
exports.static = functions.https.onRequest((req, res) => {
	if (req.method !== 'GET') {
		res.status(403).json({error: 'Forbidden method'});
	}
	req.url = '/api/app-diag/static';
	return handlers.static(req, res);
});

/**
 * Client application server dynamic data.
 */
exports.dynamic = functions.https.onRequest((req, res) => {
	if (req.method !== 'GET') {
		res.status(403).json({error: 'Forbidden method'});
	}
	req.url = '/api/app-diag/dynamic';
	return handlers.dynamic(req, res);
});

/**
 * Users list.
 */
exports.users = functions.https.onRequest((req, res) => {
	if (req.method !== 'GET') {
		res.status(403).json({error: 'Forbidden method'});
	}
	req.url = '/api/users';
	return handlers.users(req, res);
});
