var Frame = {
	WIDTH:64,
	HEIGHT:64
};

var Keys = {
	Backspace:8,
	Space:32,
	LShift:16,
	Left:37,
	Up:38,
	Right:39,
	Down:40,
	A:65,
	B:66,
	C:67,
	D:68,
	E:69,
	F:70,
	G:71,
	H:72,
	I:73,
	J:74,
	K:75,
	L:76,
	M:77,
	N:78,
	O:79,
	P:80,
	Q:81,
	R:82,
	S:83,
	T:84,
	U:85,
	V:86,
	W:87,
	X:88,
	Y:89,
	Z:90
};

var Animation = {
	Walk:{
		Up:{
			row:8,
			frames:9
		},
		Right:{
			row:11,
			frames:9
		},
		Down:{
			row:10,
			frames:9
		},
		Left:{
			row:9,
			frames:9
		}
	},
	Stand:{
		Up:{
			row:8,
			frames:1
		},
		Right:{
			row:11,
			frames:1
		},
		Down:{
			row:10,
			frames:1
		},
		Left:{
			row:9,
			frames:1
		}
	},
	Attack:{
		Up:{
			row:12,
			frames:6
		},
		Right:{
			row:15,
			frames:6
		},
		Down:{
			row:14,
			frames:6
		},
		Left:{
			row:13,
			frames:6
		}
	}
};

var Gender = {
	Male:"male",
	Female:"female"
};

var Skin = {
	Light:"light",
	Tanned:"tanned",
	Tanned2:"tanned2",
	Dark:"dark",
	Dark2:"dark2"
};

var Eyes = {
	Blue:"blue",
	Brown:"brown",
	Gray:"gray",
	Green:"green",
	Orange:"orange",
	Purple:"purple",
	Red:"red",
	Yellow:"yellow"
};

var HairStyle = {
	BangsLong:"bangslong",
	Loose:"loose",
	Ponytail:"ponytail"
};

var HairColor = {
	Blonde:"blonde",
	Brown:"brown"
};

var Direction = {
	Up:0,
	Right:1,
	Bottom:2,
	Left:3
};

var Class = {
	Fighter:{
		name:"fighter",
		description:"[Placeholder] A heavily armored melee fighter."
	},
	Initiate:{
		name:"initiate",
		description:"[Placeholder] Mystical caster that can specialize into a variety of disciplines."
	},
	Acolyte:{
		name:"acolyte",
		description:"[Placeholder] Religous caster, can choose to specialize into either a holy or natural path."
	},
	Archer:{
		name:"archer",
		description:"[Placeholder] A light ranged fighter."
	},
	Rogue:{
		name:"rogue",
		description:"[Placeholder] An agile melee fighter."
	}
};