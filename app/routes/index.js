'use strict';

const path = process.cwd();

module.exports = function(app, fs, SrvInfo, DBmocks) {

	app.get('/', (req, res) => {
		res.sendFile(path + '/public/index.html', {
			headers: {
				'Views': req.session.views
			}
		});
	});

	app.get('/api/app-diag/usage', (req, res) => {
		/*
		*	reports user sessions codes list with views count
		*/
		let filesList;
		fs.readdir(path + '/sessions', (err, data) => {
			if (err) throw err;
			// console.log('data', data);
			filesList = data.filter(item => item !== '.gitkeep');
			const output = [];
			for (const file of filesList) {
				const contents = JSON.parse(fs.readFileSync(path + '/sessions/' + file).toString());
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
	});

	app.get('/api/app-diag/static', (req, res) => {
		res.format({
			'application/json': () => {
				res.send(SrvInfo['static']());
			}
		});
	});

	app.ws('/api/app-diag/dynamic', (ws) => {
		console.log('websocket opened /app-diag/dynamic');
		let sender = null;
		ws.on('message', (msg) => {
			console.log('message:',msg);
			function sendData () {
				ws.send(JSON.stringify(SrvInfo['dynamic']()), (err) => {if (err) throw err;});
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
	});

	// api mock
	app.get('/api/users', (req, res) => {
		res.json(DBmocks.users);
	});
};
