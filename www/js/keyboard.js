var Keys = {
	Backspace:8,
	Space:32,
	Left:37,
	Up:38,
	Right:39,
	Down:40,
	A:65,
	B:66,
	C:67,
	D:68,
	E:69,
	F:70,
	G:71,
	H:72,
	I:73,
	J:74,
	K:75,
	L:76,
	M:77,
	N:78,
	O:79,
	P:80,
	Q:81,
	R:82,
	S:83,
	T:84,
	U:85,
	V:86,
	W:87,
	X:88,
	Y:89,
	Z:90
}

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