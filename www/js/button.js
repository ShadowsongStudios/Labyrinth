function Button(rect, callback) {
	var self = this;

	this.rect = rect;
	this.callback = callback;

	this.update = function() {
		if(self.rect.contains(mouse.State.X, mouse.State.Y) && (!mouse.State.Left && mouse.Prev.Left)) {
			self.callback();
		}
	}
}