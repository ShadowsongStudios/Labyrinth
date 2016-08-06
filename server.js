var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('labyrinth');
var scrypt = require('js-scrypt');

var Component = require('./scripts/component.js');
var Dungeon = require('./scripts/dungeon.js');

var room_5x5_n_data = require('./components/room_5x5_n.json');
var room_5x5_s_data = require('./components/room_5x5_s.json');
var room_5x5_w_data = require('./components/room_5x5_w.json');
var hall_nse_data = require('./components/hall_nse.json');
var hall_wne_data = require('./components/hall_wne.json');
var end_n_data = require('./components/end_n.json');
var end_e_data = require('./components/end_e.json');
var end_s_data = require('./components/end_s.json');
var end_w_data = require('./components/end_w.json');

var Players = [];
var min_name_length = 5;

var Components = [];
Components.push(new Component(room_5x5_n_data));
Components.push(new Component(room_5x5_s_data));
Components.push(new Component(room_5x5_w_data));
Components.push(new Component(hall_nse_data));
Components.push(new Component(hall_wne_data));
Components.push(new Component(end_n_data));
Components.push(new Component(end_e_data));
Components.push(new Component(end_s_data));
Components.push(new Component(end_w_data));

var Dungeons = [];

app.use(express.static('www'));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log("a user connected");

	scrypt.hash("testing", "testing", function(err, res) {
		console.log(res.toString("hex"));
	})

	socket.on('login_attempt', function(data) {
		if(data.pass == '' || data.user == '') {
			socket.emit('login_attempt', { success:false });
			return;
		}
		scrypt.hash(data.pass, data.user, function(err, res) {
			db.serialize(function() {
				db.all("SELECT rowid as ID, Password FROM accounts WHERE Username='" + data.user + "'", function(err, row) {
					if(err) {
						console.log(err);
						return;
					}

					if(row.length == 0) {
						socket.emit('login_attempt', { success:false });
						return;
					}

					if(row[0].Password == res.toString("hex")) { // Login Successful
						scrypt.hash(row[0].ID + data.user + data.pass + Date.now(), "", function(err, res) {
							socket.id = row[0].ID;
							socket.token = res.toString("hex");
							socket.lastActive = Date.now();
							Players.push(socket);

							socket.emit('login_attempt', { success:true, id:row[0].ID, token:socket.token });
						});
					} else { // Login Failed
						socket.emit('login_attempt', { success:false });
					}
				});
			});
		});
	});

	socket.on('req_char_info', function(data) {
		console.log("Character selection info requested: " + data.token);

		var token = data.token;
		var player = Players.filter(function(o) { return o.token == token; });
		if(player.length == 0) return;
		player = player[0];

		db.serialize(function() {
			db.all("SELECT * FROM characters WHERE AccountID='" + player.id + "'", function(err, rows) {
				if(err) { console.log(err); return; }

				for(var i = 0; i < rows.length; i++) {
					console.log("Sent character info: " + rows[i].Name);
					socket.emit('char_sel_info', { success:true, last:false, data:rows[i] });
				}

				socket.emit('char_sel_info', {success:true, last:true, data:{}});
			});
		})
	});

	socket.on('check_name', function(data) {
		if(!NameValid(socket, data.name)) return;

		var player = Players.filter(function(o) { return o.token == data.token; });
		if(player.length == 0) return;
		player = player[0];

		db.serialize(function() {
			var count = 0;
			db.each("SELECT DISTINCT rowid FROM characters WHERE LOWER(Name) LIKE LOWER((?))", [data.name], function(err, row) {
				if(err) console.log(err);
				count++;
			}, function() {
				if(count > 0) socket.emit('check_name', {success:false, message:"Character name is already in use."});
				else socket.emit('check_name', {success:true});
			});
		});
	});

	socket.on('create_character', function(data) {
		if(!NameValid(socket, data.name)) return;

		var player;
		if(player = GetPlayerFromToken(data.token)) {
			db.serialize(function() {
				var count = 0;
				db.each("SELECT DISTINCT rowid FROM characters WHERE LOWER(Name) LIKE LOWER((?))", [data.name], function(err, row) {
					if(err) console.log(err);
					count++;
				}, function() {
					if(count > 0) {
						socket.emit('check_name', {available:false});
						return;
					}
					
					// Name is available, create character
					var cdata = [player.id, data.name];
					for(var prop in data.cData) {
						if(data.cData.hasOwnProperty(prop)) {
							cdata.push(data.cData[prop]);
						}
					}
					db.run("INSERT INTO characters(AccountID, Name, Class, Gender, Skin, Eyes, HairStyle, HairColor) VALUES((?), (?), (?), (?), (?), (?), (?), (?))", cdata, function(err) {
						if(err) console.log(err);
						console.log("Chracter Created: " + data.name);
						socket.emit('create_character', {});
					});
				});
			});
		}
	});

	socket.on('request_dungeon', function(data) {
		var dungeon = new Dungeon(0, Components);
		dungeon.generate(function(token) {
			console.log("Dungeon Generated: " + token);
			Dungeons[token] = dungeon;
			socket.emit('dungeon_generated', {token:token});
		});
	});

	socket.on('request_component', function(data) {
		var dungeon = Dungeons[data.token];
		for(var i = 0; i < dungeon.components.length; i++) {
			socket.emit('dungeon_component', {
				id:dungeon.components[i].id,
				x:dungeon.components[i].x,
				y:dungeon.components[i].y,
				remaining:dungeon.components.length - i - 1
			});
		}	
	});

	socket.on('disconnect', function() {
		Players.splice(Players.indexOf(socket), 1);
		console.log("user disconnected");
	})
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});

function GetPlayerFromToken(token) {
	var player = Players.filter(function(o) { return o.token == token; });
	if(player.length == 0) return false;
	return player[0];
}

function NameValid(socket, name) {
	if(name.length < min_name_length) {
		socket.emit('check_name', {success:false, message:"Character name must be at least " + min_name_length + " characters long."});
		return false;
	} else if(!name.match(/^[a-z0-9]+$/i)) {
		socket.emit('check_name', {success:false, message:"Character name contains invalid characters."});
		return false;
	}
	return true;
}