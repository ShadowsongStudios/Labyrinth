function Keyboard() {
	var self = this;

	this.keys = [];
	this.State = [];
	this.Prev = [];

	this.onKeyDown = function(e) {
		self.keys[e.which] = true;
	};

	this.onKeyUp = function(e) {
		self.keys[e.which] = false;
	};

	this.update = function() {
		self.Prev = JSON.parse(JSON.stringify(self.State));
		self.State = JSON.parse(JSON.stringify(self.keys));
	};

	this.getKeyFromCode = function(code) {
		for(var letter in Keys) {
			if(Keys.hasOwnProperty(letter)) {
				if(Keys[letter] == code) return letter;
			}
		}
		return false;
	};
}