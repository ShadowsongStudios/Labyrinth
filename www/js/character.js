function Character(x, y, screen, name, charClass, gender, skin, hair_style, hair_color, eyes) {
	var self = this;

	this.render = new PIXI.Container();
	this.render.x = x;
	this.render.y = y;

	this.dir = Direction.Down;
	this.speed = 2;
	this.vx = 0;
	this.vy = 0;

	this.paralyzed = false;

	this.class = charClass;

	this.gender = gender;
	this.skin = skin;
	this.hairStyle = hair_style;
	this.hairColor = hair_color;
	this.eyes = eyes;

	this.bodySprite = null;
	this.hairSprite = null;
	this.eyeSprite = null;

	this.slot_chest = null;
	this.slot_legs = null;

	this.anim = Animation.Walk.Left;
	this.anim_prev = Animation.Walk.Left;
	this.anim_frame = 0;
	this.anim_delay = 60 / 10;
	this.anim_cur_delay = this.anim_delay;
	this.anim_end = function() {};

	this.attacking = false;
	this.attack_max_delay = 0.25 * FPS; // Test variable, will move to weapon class
	this.attack_cur_delay = this.attack_max_delay;

	this.buildSprite = function() {
		self.bodySprite = new PIXI.Sprite(PIXI.loader.resources["body_" + self.gender + "_" + self.skin].texture);
		self.hairSprite = new PIXI.Sprite(PIXI.loader.resources["hair_" + self.gender + "_" + self.hairStyle + "_" + self.hairColor].texture);
		self.eyeSprite = new PIXI.Sprite(PIXI.loader.resources["body_" + self.gender + "_eyes_" + self.eyes].texture);
		
		self.slot_chest = new Armor(new PIXI.Sprite(PIXI.loader.resources[self.gender + "_torso_starter"].texture), EquipmentSlot.Chest);
		self.slot_legs = new Armor(new PIXI.Sprite(PIXI.loader.resources[self.gender + "_legs_starter"].texture), EquipmentSlot.Legs);

		self.updateSprites(0);

		for(var i = self.render.children.length - 1; i >= 0; i--) {
			self.render.removeChild(self.render.children[i]);
		}

		self.render.addChild(self.bodySprite);
		self.render.addChild(self.eyeSprite);

		self.render.addChild(self.slot_chest.sprite);
		self.render.addChild(self.slot_legs.sprite);

		self.render.addChild(self.hairSprite);
	};

	this.updateSprites = function(frame) {
		var rect = self.getFrameRect(self.anim, self.anim_frame);

		self.bodySprite.texture.frame = rect;
		self.hairSprite.texture.frame = rect;
		self.eyeSprite.texture.frame = rect;

		self.slot_chest.updateSprite(rect);
		self.slot_legs.updateSprite(rect);
	};

	this.getFrameRect = function(anim, frame) {
		if(frame >= anim.frames || frame < 0) throw "Frame out of range";
		return new PIXI.Rectangle(frame * Frame.WIDTH, anim.row * Frame.HEIGHT, Frame.WIDTH, Frame.HEIGHT);
	};

	this.update = function() {
		var moving = false;

		if(!self.paralyzed) {
			if(!self.attacking) self.attacking = self.handleAttack();
			if(!self.attacking) {
				moving = self.handleMovement();
			}
		}

		switch(self.dir) {
			case Direction.Up:
				if(self.anim != self.anim_prev) self.frame = 0;
				if(moving) self.setAnim(Animation.Walk.Up);
				else if(self.attacking) self.setAnim(Animation.Attack.Up);
				else self.setAnim(Animation.Stand.Up);
				break;
			case Direction.Right:
				if(self.anim != self.anim_prev) self.frame = 0;
				if(moving) self.setAnim(Animation.Walk.Right);
				else if(self.attacking) self.setAnim(Animation.Attack.Right);
				else self.setAnim(Animation.Stand.Right);
				break;
			case Direction.Down:
				if(self.anim != self.anim_prev) self.frame = 0;
				if(moving) self.setAnim(Animation.Walk.Down);
				else if(self.attacking) self.setAnim(Animation.Attack.Down);
				else self.setAnim(Animation.Stand.Down);
				break;
			case Direction.Left:
				if(self.anim != self.anim_prev) self.frame = 0;
				if(moving) self.setAnim(Animation.Walk.Left);
				else if(self.attacking) self.setAnim(Animation.Attack.Left);
				else self.setAnim(Animation.Stand.Left);
		}

		if(self.anim_cur_delay <= 0) {
			self.anim_cur_delay = self.anim_delay;
			self.anim_frame++;
			if(self.anim_frame >= self.anim.frames) {
				self.anim_frame = 0;
				if(self.anim == Animation.Walk.Up || self.anim == Animation.Walk.Right || self.anim == Animation.Walk.Down || self.anim == Animation.Walk.Left) self.anim_frame = 1;
				self.anim_end();
			}

			self.updateSprites();
		} else self.anim_cur_delay--;
	};

	self.handleMovement = function() {
		var moving = false;

		if(keyboard.State[Keys.W]) {
			moving = true;
			self.vy = -1;
			self.dir = Direction.Up;
		} else if(keyboard.State[Keys.S]) {
			moving = true;
			self.vy = 1;
			self.dir = Direction.Down;
		} else {
			self.vy = 0;
		}

		if(keyboard.State[Keys.A]) {
			moving = true;
			self.vx = -1;
			self.dir = Direction.Left;
		} else if(keyboard.State[Keys.D]) {
			moving = true;
			self.vx = 1;
			self.dir = Direction.Right;
		} else {
			self.vx = 0;
		}

		// Get movement vector magnitude
		var abs_m = Math.sqrt((self.vx * self.vx) + (self.vy * self.vy));
		// If magnitude is not 0
		if(abs_m != 0) {
			// Normalize vector components
			self.vx /= abs_m;
			self.vy /= abs_m;

			// Apply movement vector * speed to position
			self.render.x += self.vx * self.speed;
			self.render.y += self.vy * self.speed;
		}

		self.anim_end = function() {};
		return moving;
	};

	self.handleAttack = function() {
		if(self.attack_cur_delay > 0) { // Too soon to attack again
			self.attack_cur_delay--;
			return false;
		}

		if(mouse.State.Left) { // If clicking
			self.attack_cur_delay = self.attack_max_delay;

			self.anim_frame = 0;
			self.anim_cur_delay = 0;

			self.anim_end = function() {
				self.attacking = false;
			};
			return true;
		}

		return false;
	};

	self.setAnim = function(anim) {
		self.anim_prev = self.anim;
		self.anim = anim;
	};

	self.setGender = function(gender) {
		self.gender = gender;
		self.buildSprite();
	};

	self.setSkinColor = function(color) {
		self.skin = Skin[color];
		self.buildSprite();
	};

	self.setHairStyle = function(style) {
		self.hairStyle = HairStyle[style];
		self.buildSprite();
	};

	self.setHairColor = function(color) {
		self.hairColor = HairColor[color];
		self.buildSprite();
	};

	self.setEyeColor = function(color) {
		self.eyes = Eyes[color];
		self.buildSprite();
	};

	self.setClass = function(charClass) {
		self.class = charClass;
	}

	self.serialize = function() {
		return {
			class:self.class,
			gender:self.gender,
			skin:self.skin,
			eyes:self.eyes,
			hairStyle:self.hairStyle,
			hairColor:self.hairColor
		};
	};

	self.buildSprite();

	screen.addChild(self.render);
}