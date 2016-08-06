var Rectangle = require('./rectangle.js');

module.exports = function Component(data) {
	var self = this;

	this.id = data.id;
	this.width = data.width;
	this.height = data.height;
	this.map = data.map;
	this.nodes = data.nodes;

	this.x = 0;
	this.y = 0;

	this.rect = new Rectangle(self.x, self.y, self.width, self.height);

	this.getExits = function(dir) {
		return self.nodes.filter(function(val) {
			if(dir == "") return val.tag == "exit" && !val.paired;
			else return val.tag == "exit" && val.direction == dir && !val.paired;
		});
	};

	this.setNode = function(node) {
		for(var i = 0; i < nodes.length; i++) {
			if(nodes[i].id == node.id) {
				nodes[i] = node;
				return;
			}
		}
		return false;
	};

	this.setPos = function(x, y) {
		self.x = x;
		self.y = y;

		self.rect.x = x;
		self.rect.y = y;
	};

	this.getID = function() {
		return self.id;
	}
}