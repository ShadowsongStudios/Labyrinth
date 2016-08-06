function DungeonScreen() {
	var self = this;

	this.token = '';
	this.components = [];

	this.debug_components = [];

	this.offsetX = 0;
	this.offsetY = 0;

	this.camera;
	this.character;

	this.load = function(character) {
		socket.emit("request_dungeon");

		state = self.update;

		self.character = character;
		self.character.paralyzed = false;
		self.loadComplete();
	};

	this.loadComplete = function() {
		dungeonScreen.visible = true;

		self.camera = new Camera(self.character, dungeonScreen);
	};

	this.update = function() {
		self.character.update();
		self.camera.update();
	};

	this.offload = function() {
		dungeonScreen.visible = false;
	};

	this.onDungeonGenerated = function(data) {
		self.token = data.token;
		socket.emit('request_component', {token:self.token});
	};

	this.onReceiveComponent = function(data) {
		self.debug_components.push(data);

		var temp = new PIXI.Sprite(PIXI.loader.resources[data.id].texture);
		temp.x = data.x;
		temp.y = data.y;
		dungeonScreen.addChild(temp);

		self.components.push(temp);

		if(-temp.x > self.offsetX) self.offsetX = -temp.x;
		if(-temp.y > self.offsetY) self.offsetY = -temp.y;

		if(data.remaining == 0) {
			for(var i = 0; i < self.components.length; i++) {
				self.components[i].x -= 128;
				self.components[i].y -= 128;
			}
			dungeonScreen.removeChild(self.character.render);
			dungeonScreen.addChild(self.character.render);
		}
	};
}