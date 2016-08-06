var EquipmentSlot = {
	Head:"head",
	Chest:"chest",
	Legs:"legs",
	Feet:"feet"
}

function Armor(sprite, type) {
	var self = this;

	this.sprite = sprite;

	this.type = type;
	this.defense = 0;

	this.updateSprite = function(rect) {
		self.sprite.texture.frame = rect;
	};
}