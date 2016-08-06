function LoadingScreen() {
	var self = this;

	this.loadingBar;
	this.loadingMessage;

	this.offloading = false;

	this.load = function() {
		self.loadingBar = new PIXI.Container();
		self.loadingBar.position.set(50, (renderer.height / 2) - 10);
		loadingScreen.addChild(self.loadingBar);

		var innerBar = new PIXI.Graphics();
		innerBar.beginFill(0x000000);
		innerBar.lineStyle(2, 0xFFFFFF, 1);
		innerBar.drawRect(0, 0, 860, 20);
		innerBar.endFill();
		self.loadingBar.addChild(innerBar);

		var outerBar = new PIXI.Graphics();
		outerBar.beginFill(0xFFFFFF);
		outerBar.drawRect(2, 2, 856, 16);
		outerBar.endFill();
		self.loadingBar.addChild(outerBar);

		self.loadingBar.outer = outerBar;
		self.loadingBar.outer.width = 856;

		self.loadingMessage = new PIXI.Text("", {font:"18px Cinzel", fill:"white"});
		//self.loadingMessage.style = {align:"center"};
		self.loadingMessage.position.set(renderer.width / 2, (renderer.height / 2) - 40);
		loadingScreen.addChild(self.loadingMessage);

		PIXI.loader
			// Dungeon Components
			.add("hall_nse", "image/components/hall_nse.png")
			.add("hall_wne", "image/components/hall_wne.png")
			.add("room_5x5_n", "image/components/room_5x5_n.png")
			.add("room_5x5_s", "image/components/room_5x5_s.png")
			.add("room_5x5_w", "image/components/room_5x5_w.png")
			.add("end_n", "image/components/end_n.png")
			.add("end_e", "image/components/end_e.png")
			.add("end_s", "image/components/end_s.png")
			.add("end_w", "image/components/end_w.png")
			// Male Bodies
			.add("body_male_light", "image/character/body/male/light.png")
			.add("body_male_tanned", "image/character/body/male/tanned.png")
			.add("body_male_tanned2", "image/character/body/male/tanned2.png")
			.add("body_male_dark", "image/character/body/male/dark.png")
			.add("body_male_dark2", "image/character/body/male/dark2.png")
			// Male Eyes
			.add("body_male_eyes_blue", "image/character/body/male/eyes/blue.png")
			.add("body_male_eyes_brown", "image/character/body/male/eyes/brown.png")
			.add("body_male_eyes_gray", "image/character/body/male/eyes/gray.png")
			.add("body_male_eyes_green", "image/character/body/male/eyes/green.png")
			.add("body_male_eyes_orange", "image/character/body/male/eyes/orange.png")
			.add("body_male_eyes_purple", "image/character/body/male/eyes/purple.png")
			.add("body_male_eyes_red", "image/character/body/male/eyes/red.png")
			.add("body_male_eyes_yellow", "image/character/body/male/eyes/yellow.png")
			// Female Bodies
			.add("body_female_light", "image/character/body/female/light.png")
			.add("body_female_tanned", "image/character/body/female/tanned.png")
			.add("body_female_tanned2", "image/character/body/female/tanned2.png")
			.add("body_female_dark", "image/character/body/female/dark.png")
			.add("body_female_dark2", "image/character/body/female/dark2.png")
			// Female Eyes
			.add("body_female_eyes_blue", "image/character/body/female/eyes/blue.png")
			.add("body_female_eyes_brown", "image/character/body/female/eyes/brown.png")
			.add("body_female_eyes_gray", "image/character/body/female/eyes/gray.png")
			.add("body_female_eyes_green", "image/character/body/female/eyes/green.png")
			.add("body_female_eyes_orange", "image/character/body/female/eyes/orange.png")
			.add("body_female_eyes_purple", "image/character/body/female/eyes/purple.png")
			.add("body_female_eyes_red", "image/character/body/female/eyes/red.png")
			.add("body_female_eyes_yellow", "image/character/body/female/eyes/yellow.png")
			// Female Gear
			.add("torso_shirts_sleeveless_female_brown_pirate", "image/character/torso/shirts/sleeveless/female/brown_pirate.png")
			.add("legs_pants_female_red_pants", "image/character/legs/pants/female/red_pants_female.png")
			// Female Starter Gear
			.add("female_torso_starter", "image/character/torso/shirts/sleeveless/female/brown_sleeveless.png")
			.add("female_legs_starter", "image/character/legs/pants/female/teal_pants_female.png")
			// Male Starter Gear
			.add("male_torso_starter", "image/character/torso/shirts/longsleeve/male/brown_longsleeve.png")
			.add("male_legs_starter", "image/character/legs/pants/male/teal_pants_male.png")
			// Hair
			.add("hair_female_bangslong_blonde", "image/character/hair/female/bangslong/blonde.png")
			.add("hair_female_bangslong_brown", "image/character/hair/female/bangslong/brown.png")
			.add("hair_female_loose_blonde", "image/character/hair/female/loose/blonde.png")
			.add("hair_female_loose_brown", "image/character/hair/female/loose/brown.png")
			.add("hair_female_ponytail_blonde", "image/character/hair/female/ponytail/blonde.png")
			.add("hair_female_ponytail_brown", "image/character/hair/female/ponytail/brown.png")
			.add("hair_male_bangslong_blonde", "image/character/hair/male/bangslong/blonde.png")
			.add("hair_male_bangslong_brown", "image/character/hair/male/bangslong/brown.png")
			.add("hair_male_loose_blonde", "image/character/hair/male/loose/blonde.png")
			.add("hair_male_loose_brown", "image/character/hair/male/loose/brown.png")
			.add("hair_male_ponytail_blonde", "image/character/hair/male/ponytail/blonde.png")
			.add("hair_male_ponytail_brown", "image/character/hair/male/ponytail/brown.png")
			.on("progress", self.loadProgressHandler)
			.load(self.loadComplete);

		loadingScreen.visible = true;
	};

	this.loadComplete = function() {
		console.log("All files loaded.");
		state = self.update;

		self.offloading = true;
	};

	this.update = function() {
		if(self.offloading) {
			loadingScreen.alpha -= 0.05;
			if(loadingScreen.alpha <= 0) {
				loadingScreen.alpha = 0;
				SwitchTo("charSelectionScreen");
			}
		}
	};

	this.offload = function() {
		loadingScreen.visible = false;
	};

	this.loadProgressHandler = function(loader, resource) {
		console.log("Loaded: " + resource.name);
		self.loadingMessage.text = "Loading: " + resource.name;
		self.loadingMessage.position.set((renderer.width / 2) - (self.loadingMessage.width / 2), (renderer.height / 2) - 40);
		self.loadingBar.outer.width = (loader.progress / 100) * 856;
	};
}