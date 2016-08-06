function Mouse() {
	var self = this;

	this.data = {
		Left:false,
		Right:false,
		X:0,
		Y:0
	}
	this.State = {};
	this.Prev = {};

	this.onMouseDown = function(e) {
		e.preventDefault();
		e.stopPropagation();

		switch(e.which) {
			case 1: // Left
				self.data.Left = true;
				break;
			case 3: // Right
				self.data.Right = true;
				break;
		}
	};

	this.onMouseUp = function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		switch(e.which) {
			case 1: // Left
				self.data.Left = false;
				break;
			case 3: // Right
				self.data.Right = false;
				break;
		}
	};

	this.onMouseMove = function(e) {
		self.data.X = e.offsetX;
		self.data.Y = e.offsetY;
	};

	this.update = function() {
		self.Prev = JSON.parse(JSON.stringify(self.State));
		self.State = JSON.parse(JSON.stringify(self.data));
	};
}