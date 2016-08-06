var $ = require('jquery');
var extend = require('extend');
var scrypt = require('js-scrypt');

var Component = require('./component.js');

var component_data = [];
component_data['room_5x5_n'] = require('../components/room_5x5_n.json');
component_data['room_5x5_s'] = require('../components/room_5x5_s.json');
component_data['room_5x5_w'] = require('../components/room_5x5_w.json');
component_data['hall_nse'] = require('../components/hall_nse.json');
component_data['hall_wne'] = require('../components/hall_wne.json');
component_data['end_n'] = require('../components/end_n.json');
component_data['end_e'] = require('../components/end_e.json');
component_data['end_s'] = require('../components/end_s.json');
component_data['end_w'] = require('../components/end_w.json');

module.exports = function Dungeon(owner_id, Components) {
	var self = this;

	this.owner = owner_id;

	this.components = [];

	this.generate = function(callback) {
		// Create start component
		// TODO: Stringify/Parse
		var current = new Component(JSON.parse(JSON.stringify(component_data['hall_nse'])));
		current.setPos(0, 0);
		self.components.push(current);
		// Call add function on created component
		self.addComponents(current);

		self.generate_token(callback);
	};

	this.addComponents = function(cur) {
		// Get all exits on current component
		var exits = cur.getExits("");

		// Loop through them
		var attempts = 5;
		for(var i = 0; i < exits.length; i++) {
			if(attempts <= 0) continue;

			// Get all components with matching exits
			var options = Components.filter(function(val) {
				var cur_exits = val.getExits(self.matchExit(exits[i].direction));
				return cur_exits.length > 0;
			});

			// Choose valid component at random
			if(options.length == 0) return;

			var obj = component_data[options[Math.floor(Math.random() * options.length)].id];
			var chosen = new Component(JSON.parse(JSON.stringify(obj)));
			// Choose random matching exit from component
			var matching_exits = chosen.getExits(self.matchExit(exits[i].direction));
			var chosen_exit = matching_exits[Math.floor(Math.random() * matching_exits.length)];

			chosen.setPos(cur.x + exits[i].x - chosen_exit.x, cur.y + exits[i].y - chosen_exit.y);
			var found = false;
			for(var j = 0; j < self.components.length; j++) {
				if(chosen.rect.Intersects(self.components[j].rect)) {
					found = true;
					break;
				}
			}
			if(found) {
				i--;
				attempts--;
				continue;
			}

			chosen_exit.paired = true;
			exits[i].paired = true;

			self.components.push(chosen);
			self.addComponents(chosen);
			attempts = 5;
		}
	};

	this.matchExit = function(dir) {
		switch(dir) {
			case "north":
				return "south";
			case "east":
				return "west";
			case "south":
				return "north";
			case "west":
				return "east";
		}
		return false;
	};

	this.generate_token = function(callback) {
		var data = "";

		for(var i = 0; i < self.components.length; i++) {
			data += self.components[i].id;
			data += self.components[i].x;
			data += self.components[i].y;
		}

		scrypt.hash(data, "", function(err, res) {
			callback(res.toString("hex"));
		});
	};
}