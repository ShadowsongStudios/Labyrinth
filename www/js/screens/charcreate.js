function CharacterCreationScreen() {
	var self = this;

	this.character;
	this.buttons = [];

	this.cursor;
	this.name = "";
	this.name_text;

	this.male_label;
	this.female_label;
	this.skin_color_label;
	this.hair_style_label;
	this.hair_color_label;
	this.eye_color_label;
	this.class_label;
	this.class_desc_label;

	this.load = function() {
		self.name = "";
		$("#capture").val("").focus();
		$("#capture").on("keydown", function(e) {
			if($(this).val().length >= 12 && e.which != 8) return false;
		});
		$("#capture").on("keyup", function(e) {
			var str = $(this).val();
			str = str.replace(/[^a-zA-Z 0-9]+/g, '');
			$(this).val(str);

			self.name = $(this).val();
			self.name_text.text = self.name;
		});

		self.addViewport();
		self.addNameInput();
		self.addGenderInput();
		self.addSkinInput();
		self.addHairInput();
		self.addEyeInput();
		self.addClassInput();
		self.addCreateButton();

		var old_x = charCreationScreen.x;
		charCreationScreen.x = (renderer.width - charCreationScreen.width) / 2;
		var diff = charCreationScreen.x - old_x;
		for(var i = 0; i < self.buttons.length; i++) {
			self.buttons[i].rect.x += diff;
		}

		state = self.update;
		self.loadComplete();
	};

	this.loadComplete = function() {
		charCreationScreen.visible = true;
	};

	this.update = function() {
		for(var i = 0; i < self.buttons.length; i++) {
			self.buttons[i].update();
		}

		self.character.update();
	};

	this.offload = function() {
		charCreationScreen.visible = false;
	};

	this.addViewport = function() {
		// Draw Character Backing
		self.addStaticBacking(2, 2, 100, 100);

		// Character Preview
		self.character = new Character(20, 15, charCreationScreen, "", Class.Fighter.name, Gender.Male, Skin.Light, HairStyle.BangsLong, HairColor.Blonde, Eyes.Blue);
		self.character.paralyzed = true;

		// Rotate Left
		var x = 2, y = 110, w = 20, h = 50;
		self.addStaticBacking(x, y, w, h);
		self.addStaticLabel("<", x + 4, y + 10, "#666666");
		self.buttons.push(new Button(new PIXI.Rectangle(x, y, w, h), function() {
			self.character.anim = Animation.Stand.Left;
			self.character.dir = Direction.Left;
			self.character.updateSprites();
		}));

		// Rotate Right
		var x = 80, y = 110, w = 20, h = 50;
		self.addStaticBacking(x, y, w, h);
		self.addStaticLabel(">", x + 4, y + 10, "#666666");

		self.buttons.push(new Button(new PIXI.Rectangle(x, y, w, h), function() {
			self.character.anim = Animation.Stand.Right;
			self.character.dir = Direction.Right;
			self.character.updateSprites();
		}));

		// Rotate Up
		var x = 30, y = 110, w = 42, h = 20;
		self.addStaticBacking(x, y, w, h);
		self.addStaticLabel("<", x + 36, y + 4, "#666666", 1.5706);

		self.buttons.push(new Button(new PIXI.Rectangle(x, y, w, h), function() {
			self.character.anim = Animation.Stand.Up;
			self.character.dir = Direction.Up;
			self.character.updateSprites();
		}));

		// Rotate Down
		var x = 30, y = 140, w = 42, h = 20;
		self.addStaticBacking(x, y, w, h);
		self.addStaticLabel(">", x + 36, y + 5, "#666666", 1.5706);

		self.buttons.push(new Button(new PIXI.Rectangle(x, y, w, h), function() {
			self.character.anim = Animation.Stand.Down;
			self.character.dir = Direction.Down;
			self.character.updateSprites();
		}));
	};

	this.addNameInput = function() {
		// Name Label
		self.addStaticLabel("Character Name", 130, 5);

		// Name Input
		self.addStaticBacking(120, 52, 320, 50);

		// Name String
		self.name_text = new PIXI.Text("", {font:"24px Cinzel", fill:"white"});
		self.name_text.position.set(135, 62);
		charCreationScreen.addChild(self.name_text);
	};

	this.addGenderInput = function() {
		// Gender Label
		self.addStaticLabel("Gender:", 130, 120);

		// Male Label
		self.male_label = self.addStaticLabel("Male", 250, 120);
		self.buttons.push(new Button(new PIXI.Rectangle(250, 120, self.male_label.width, self.male_label.height), function() {
			if(self.character.gender != Gender.Male) {
				self.male_label.style = {font:"24px Cinzel", fill:"white"};
				self.female_label.style = {font:"24px Cinzel", fill:"#666666"};
				self.character.setGender(Gender.Male);
			}
		}));

		// Female Label
		self.female_label = self.addStaticLabel("Female", 325, 120, "#666666");
		self.buttons.push(new Button(new PIXI.Rectangle(325, 120, self.female_label.width, self.female_label.height), function() {
			if(self.character.gender != Gender.Female) {
				self.female_label.style = {font:"24px Cinzel", fill:"white"};
				self.male_label.style = {font:"24px Cinzel", fill:"#666666"};
				self.character.setGender(Gender.Female);
			}
		}));
	};

	this.addSkinInput = function() {
		self.addStaticLabel("Skin", 22, 180);

		var colors = [];
		for(var color in Skin) {
			if(Skin.hasOwnProperty(color)) {
				colors.push(color);
			}
		}

		self.skin_color_label = self.addFeaturePicker(120, 180, 320, 50, colors, 0, self.character.setSkinColor, self.skin_color_label);
	};

	this.addHairInput = function() {
		// Hair Style Label
		self.addStaticLabel("Hair", 22, 220);

		var styles = [];
		for(var Style in HairStyle) {
			if(HairStyle.hasOwnProperty(Style)) {
				styles.push(Style);
			}
		}

		var colors = [];
		for(var Color in HairColor) {
			if(HairColor.hasOwnProperty(Color)) {
				colors.push(Color);
			}
		}

		self.hair_style_label = self.addFeaturePicker(120, 220, 320, 50, styles, 0, self.character.setHairStyle, self.hair_style_label);
		self.hair_color_label = self.addFeaturePicker(120, 260, 320, 50, colors, 0, self.character.setHairColor, self.hair_color_label);
	};

	this.addEyeInput = function() {
		self.addStaticLabel("Eyes", 22, 300);

		var colors = [];
		for(var color in Eyes) {
			if(Eyes.hasOwnProperty(color)) {
				colors.push(color);
			}
		}

		self.eye_color_label = self.addFeaturePicker(120, 300, 320, 50, colors, 0, self.character.setEyeColor, self.eye_color_label);
	};

	self.addClassInput = function() {
		self.addStaticLabel("Class", 22, 340);
		self.class_desc_label = self.addStaticLabel(Class.Fighter.description, 22, 390);
		self.class_desc_label.style = {
			font:"20px Cinzel",
			fill:"white",
			wordWrap:true,
			wordWrapWidth:420,
			align:"center"
		}

		var classes = [];
		for(var charClass in Class) {
			if(Class.hasOwnProperty(charClass)) {
				classes.push(charClass);
			}
		}

		self.class_label = self.addFeaturePicker(120, 340, 320, 50, classes, 0, function(name) {
			var selected = classes.filter(function(o) {
				return Class[o].name == Class[name].name;
			})[0];
			self.class_desc_label.text = Class[selected].description;
			self.character.setClass(Class[selected].name);
		}, self.class_label);
	};

	self.addCreateButton = function() {
		var x = 2, y = 600, w = 438, h = 75;
		self.addStaticBacking(x, y, w, h);

		var dim = self.measureLabel("Create Character");
		self.addStaticLabel("Create Character", x + ((w - dim.Width) / 2), y + ((h - dim.Height) / 2));

		self.buttons.push(new Button(new PIXI.Rectangle(x, y, w, h), function() {
			socket.emit("check_name", {token:session_token, name:self.name});
		}));
	};

	this.addStaticLabel = function(text, x, y, fill, rotate) {
		var color = "white";
		if(fill != undefined) color = fill;

		var label = new PIXI.Text(text, {font:"24px Cinzel", fill:color});
		if(rotate != undefined) label.rotation = rotate;
		label.position.set(x, y);
		charCreationScreen.addChild(label);

		return label;
	};

	this.addStaticBacking = function(x, y, w, h) {
		var back = new PIXI.Graphics();
		back.lineStyle(2, 0x666666, 1);
		back.beginFill(0x333333);
		back.drawRoundedRect(0, 0, w, h, 5);
		back.endFill();
		back.position.set(x, y);
		charCreationScreen.addChild(back);
	};

	this.addFeaturePicker = function(x, y, w, h, data, index, change, label) {
		self.addStaticLabel("<", x, y);
		var sz = self.measureLabel("<");
		self.buttons.push(new Button(new PIXI.Rectangle(x, y, sz.Width, sz.Height), function() {
			index--;
			if(index < 0) index = data.length - 1;
			change(data[index]);
			self.updateLabel(label, data[index], x, y, w, h);
		}));

		var label = self.addStaticLabel(data[index], x + ((w - self.measureLabel(data[index]).Width) / 2), y);

		self.addStaticLabel(">", x + w - self.measureLabel(">").Width, y);
		self.buttons.push(new Button(new PIXI.Rectangle(x + w - self.measureLabel(">").Width, y, sz.Width, sz.Height), function() {
			index++;
			if(index >= data.length) index = 0;
			change(data[index]);
			self.updateLabel(label, data[index], x, y, w, h);
		}));

		return label;
	};

	this.updateLabel = function(label, text, x, y, w, h) {
		label.text = text;
		label.position.set(x + ((w - self.measureLabel(text).Width) / 2), y);
	};

	this.measureLabel = function(text) {
		var label = new PIXI.Text(text, {font:"24px Cinzel", fill:"white"});
		return {
			Width:label.width,
			Height:label.height
		};
	};

	this.onNameCheck = function(data) {
		if(data.success) {
			socket.emit("create_character", {token:session_token, name:self.name, cData:self.character.serialize()});
		} else {
			alert(data.message);
		}
	};

	this.onCharacterCreate = function(data) {
		alert("Character created!");
		SwitchTo("charSelectionScreen");
	};
}