function CharacterSelectionScreen() {
	var self = this;

	this.characters = [];
	this.buttons = [];

	this.mouseText;

	this.load = function() {
		for(var i = charSelectionScreen.children.length - 1; i >= 0; i--) {
			charSelectionScreen.removeChild(charSelectionScreen.children[i]);
		}
		self.characters = [];
		self.buttons = [];

		socket.emit("req_char_info", {token:session_token});

		state = self.update;
	};

	this.loadComplete = function() {
		charSelectionScreen.visible = true;
	};

	this.update = function() {
		for(var i = 0; i < self.characters.length; i++) {
			self.characters[i].update();
		}
		for(var i = 0; i < self.buttons.length; i++) {
			self.buttons[i].update();
		}
	};

	this.offload = function() {
		charSelectionScreen.visible = false;
	};

	this.onCharacterInfo = function(data) {
		var cdata = data.data;

		var x = 2;
		var y = 72 * self.characters.length;
		var w = 640;
		var h = 64;

		// Create Background
		var sprite = new PIXI.Graphics();
		sprite.lineStyle(2, 0x666666, 1);
		sprite.beginFill(0x333333);
		sprite.drawRoundedRect(0, 0, w, h, 10);
		sprite.endFill();
		sprite.position.set(x, y + 2);
		charSelectionScreen.addChild(sprite);

		if(!data.last) {
			var text = new PIXI.Text(cdata.Name, {font:"32px Cinzel", fill:"white"});
			text.position.set((w - text.width) / 2, y + ((h + 4 - text.height) / 2));
			charSelectionScreen.addChild(text);

			self.characters.push(new Character(0, y - 5, charSelectionScreen, cdata.Name, cdata.Class, cdata.Gender, cdata.Skin, cdata.HairStyle, cdata.HairColor, cdata.Eyes));
			self.characters[self.characters.length - 1].paralyzed = true;

			var index = self.characters.length - 1;
			self.buttons.push(new Button(new PIXI.Rectangle(x, y, w, h), function() {
				SwitchTo("dungeonScreen", [self.characters[index]]);
			}));
		} else {
			var text = new PIXI.Text("+", {font:"32px Cinzel", fill:"white"});
			text.position.set((w - text.width) / 2, y + ((h + 4 - text.height) / 2));
			charSelectionScreen.addChild(text);

			self.buttons.push(new Button(new PIXI.Rectangle(x, y, w, h), function() {
				SwitchTo("charCreationScreen");
			}))

			self.loadComplete();
		}
	};
}