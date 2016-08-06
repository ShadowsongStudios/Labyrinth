function Camera(target, screen) {
	var self = this;

	this.target = target;
	this.screen = screen;

	this.x = target.render.x;
	this.y = target.render.y;

	this.offset = {
		x:(renderer.width - target.render.width) / 2,
		y:(renderer.height - target.render.height) / 2
	};

	this.update = function() {
		self.x = -(target.render.x - self.offset.x);
		self.y = -(target.render.y - self.offset.y);
		self.screen.position.set(self.x, self.y);
	};
}