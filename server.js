'use strict';

const express = require('express'),
	routes = require('./app/routes/index.js'),
	session = require('express-session'),
	FileStore = require('session-file-store')(session),
	app = express(),
	expressWs = require('express-ws')(app), // eslint-disable-line no-unused-vars
	cluster = require('cluster'),
	os = require('os'),
	fs = require('fs');
let clusterStop = false;

if (!process.env.OPENSHIFT_MONGODB_DB_HOST) {
	require('dotenv').load();
}

process.title = 'ng2nodestarter';

const cwd = process.cwd();

app.use(session({
	secret: 'secretNG2NODESTARTER',
	store: new FileStore,
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day 
	}
}));

app.use('/public', express.static(cwd + '/public'));
app.use((req, res, next) => {
	/*
	*	this is required for angular to load urls properly when user requests url directly, e.g.
	*	current conditions: client index page is served fro all request
	*	which do not include control words: api, css, fonts, img, js
	*	control words explanation:
	*	api - is part of path that returnd data over REST API
	* css, fonts, img, js - are directories containing client files
	*/
	// console.log('req.path:', req.path);
	// console.log('SESSION', req.session);
	if (/(api|css|fonts|img|js)/.test(req.path)) {
		return next();
	} else {
		if (typeof req.session.viewTimestamp === 'undefined') {
			req.session.viewTimestamp = new Date().getTime();
		} else if (new Date().getTime() - req.session.viewTimestamp > 10000) {
			req.session.views = (typeof req.session.views === 'undefined') ? 1 : req.session.views + 1;
			req.session.viewTimestamp = new Date().getTime();
		}
		res.sendFile(cwd + '/public/index.html', {
			headers: {
				'Views': req.session.views
			}
		});
	}
});
/*
*	Next three lines are needed only for development purposes
*	should be commeneted out in production
*/
app.use('/node_modules', express.static(cwd + '/node_modules'));
app.use('/systemjs.config.js', express.static(cwd + '/systemjs.config.js'));
app.use('/systemjs.config.extras.js', express.static(cwd + '/systemjs.config.extras.js'));

// headers config for all Express routes
app.all('/*', function(req, res, next) {
	// CORS headers
	res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain if needed
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	// add headers to be exposed
	res.header('Access-Control-Expose-Headers', 'Views');
	// cache control
	res.header('Cache-Control', 'public, no-cache, no-store, must-ravalidate, max-age=0');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	// handle OPTIONS method
	if (req.method == 'OPTIONS') res.status(200).end();
	else next();
});

const SrvInfo = require('./app/utils/srv-info.js');
const DBmocks = {
	users: require('./app/models/users').users()
};

routes(app, fs, SrvInfo, DBmocks);

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	ip = process.env.OPENSHIFT_NODEJS_IP; // "127.0.0.1" is not specified here on purpose, this env var should be included in .openshift.env

function terminator (sig) {
	if (typeof sig === 'string') {
		console.log(`\n${Date(Date.now())}: Received signal ${sig} - terminating app...\n`);
		if (cluster.isMaster && !clusterStop) {
			cluster.fork();
		} else {
			process.exit(0);
			if (!cluster.isMaster) { console.log(`${Date(Date.now())}: Node server stopped`); }
		}
	}
}

if (!ip) {
	/*
	*   development
	*/
	app.listen(port, () => {
		console.log(`\n# > START > DEVELOPMENT > Node.js listening on port ${port}...\n`);
	});
} else {
	/*
	*   deployment - OPENSHIFT SPECIFIC
	*/
	(() => {
		/*
		*   termination handlers
		*/
		process.on('exit', () => { terminator('exit'); });
		// Removed 'SIGPIPE' from the list - bugz 852598.
		['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
			'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
		].forEach((element) => {
			process.on(element, () => {
				clusterStop = true;
				terminator(element);
			});
		});
	})();

	if (cluster.isMaster) {
		const workersCount = os.cpus().length;
		console.log(`\n# > START > PRODUCTION > Node.js listening on ${ip}:${port}...\n`);
		console.log(`Cluster setup, workers count: ${workersCount}`);
		for (let i = 0; i < workersCount; i++) {
			console.log('Starting worker',i);
			cluster.fork();
		}
		cluster.on('online', (worker,error) => {
			if (error) throw error;
			console.log('Worker pid',worker.process.pid,'is online');
		});
		cluster.on('exit', (worker, code, signal) => {
			console.log('Worker pid',worker.process.pid,'exited with code',code,'and signal',signal);
			if (!clusterStop) {
				console.log('Starting a new worker...');
				cluster.fork();
			}
		});
	} else {
		app.listen(port, ip, () => {
			console.log(`\n# > START > PRODUCTION > Node.js listening on ${ip}:${port}...\n`);
		});
	}
}
