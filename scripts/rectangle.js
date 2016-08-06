module.exports = function Rectangle(x, y, w, h) {
	var self = this;

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.Intersects = function(r) {
		if((self.x > r.x && self.x < r.x + r.w) || (r.x > self.x && r.x < self.x + self.w)) {
			if((self.y > r.y && self.y < r.y + r.h) || (r.y > self.y && r.y < self.y + self.h)) {
				return true;
			}
		}
		return false;
	};
}