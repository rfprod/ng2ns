'use strict';

/**
 * Load .env variables.
 */
require('dotenv').load();

/**
 * Server http handlers module.
 * For usage in express server and in cloud functions.
 * @param {String} cwd Current working directory
 * @param {object} fs NodeJs fs module
 * @param {object} SrvInfo server infor module
 * @param {object} DBmocks database mocks
 * @param {boolean} firebaseEnv indicates if handlers are called in firebase environment
 */
module.exports = (cwd, fs, SrvInfo, DBmocks, firebaseEnv) => {

	return {
		/**
		 * Handles hashsum request.
		 */
		hashsum: (req, res) => {
			console.log('hashsum', req.url);
			console.log('process.env.BUILD_HASH', process.env.BUILD_HASH);
			res.json({ hashsum: process.env.BUILD_HASH || 'NA' });
		},

		/**
		 * Allication usage.
		 */
		usage: (req, res) => {
			console.log('hashsum', req.url);
			if (firebaseEnv) {
				res.json([]);
			} else {
				fs.readdir(cwd + '/sessions', (err, data) => {
					if (err) throw err;
					// console.log('data', data);
					const filesList = data.filter(item => item !== '.gitkeep');
					const output = [];
					for (const file of filesList) {
						const contents = JSON.parse(fs.readFileSync(cwd + '/sessions/' + file).toString());
						const item = {
							key: file.substring(0, 6),
							y: contents.views
						};
						output.push(item);
					}
					output.sort((a, b) => {
						if (a.y < b.y) { return 1;}
						if (a.y > b.y) { return -1;}
						return 0;
					});
					if (output.length > 10) { output.length = 10; }
					res.json(output);
				});
			}
		},

		/**
		 * Server static data.
		 */
		static: (req, res) => {
			console.log('hashsum', req.url);
			res.format({
				'application/json': () => {
					res.send(SrvInfo['static']());
				}
			});
		},

		/**
		 * Dynamic server data.
		 */
		dynamic: (ws) => {
			console.log('websocket opened /app-diag/dynamic');
			let sender = null;
			ws.on('message', (msg) => {
				console.log('message:',msg);
				function sendData () {
					ws.send(JSON.stringify(SrvInfo['dynamic']()), (err) => {
						if (err) throw err;
					});
				}
				if (JSON.parse(msg).action === 'get') {
					console.log('ws open, data sending started');
					sendData();
					sender = setInterval(() => {
						sendData();
					}, 5000);
				}
				if (JSON.parse(msg).action === 'pause') {
					console.log('ws open, data sending paused');
					clearInterval(sender);
				}
			});
			ws.on('close', () => {
				console.log('Persistent websocket: Client disconnected.');
				if (ws._socket) {
					ws._socket.setKeepAlive(true);
				}
				clearInterval(sender);
			});
			ws.on('error', () => {console.log('Persistent websocket: ERROR');});
		},

		/**
		 * Handles users list request.
		 */
		users: (req, res) => {
			console.log('hashsum', req.url);
			res.json(DBmocks.users);
		}
	}

};
