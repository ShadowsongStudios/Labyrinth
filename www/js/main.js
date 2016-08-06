var renderer;
var stage;
var state;
var keyboard;
var mouse;

var socket;

var user_id;
var session_token;

// Game Screens
var loadingScreen;
var charSelectionScreen;
var charCreationScreen;
var houseScreen;
var mapScreen;
var dungeonScreen;

var activeScreen;

var screenLoading = new LoadingScreen();
var screenCharacterSelection = new CharacterSelectionScreen();
var screenCharacterCreation = new CharacterCreationScreen();
//var screenHouse = new HouseScreen();
//var screenMap = new MapScreen();
var screenDungeon = new DungeonScreen();

var screenLoaded = false;

$(document).ready(function(e) {
	InitSockets();
	InitLoginForm();
	InitPixi();
});

function SwitchTo(screen, args) {
	if(activeScreen != undefined) activeScreen.offload();

	switch(screen) {
		case "loadingScreen":
			screenLoading.load();
			activeScreen = screenLoading;
			break;
		case "charSelectionScreen":
			screenCharacterSelection.load();
			activeScreen = screenCharacterSelection;
			break;
		case "charCreationScreen":
			screenCharacterCreation.load();
			activeScreen = screenCharacterCreation;
			break;
		case "dungeonScreen":
			screenDungeon.load(args[0]);
			activeScreen = screenDungeon;
	}
}

function InitSockets() {
	socket = io();

	socket.on('login_attempt', function(data) {
		if(!data.success) {
			alert("Invalid username/password combination");
		} else {
			user_id = data.id;
			session_token = data.token;
			$(".login-ui").fadeOut(function() {
				if(!screenLoaded) {
					screenLoaded = true;
					SwitchTo("loadingScreen");
				}
			});
		}
	});

	socket.on('char_sel_info', screenCharacterSelection.onCharacterInfo);

	socket.on('check_name', screenCharacterCreation.onNameCheck);

	socket.on('create_character', screenCharacterCreation.onCharacterCreate);

	socket.on('dungeon_generated', screenDungeon.onDungeonGenerated);

	socket.on('dungeon_component', screenDungeon.onReceiveComponent);
}

function InitInput() {
	keyboard = new Keyboard();
	$(window).on('keydown', keyboard.onKeyDown);
	$(window).on('keyup', keyboard.onKeyUp);

	mouse = new Mouse();
	$(renderer.view).on('mousedown', mouse.onMouseDown);
	$(window).on('mouseup', mouse.onMouseUp);
	$(renderer.view).on('mousemove', mouse.onMouseMove);

	$(window).on('contextmenu', function(e) { e.preventDefault(); e.stopPropagation(); return false; });
}

function InitLoginForm() {
	$("#login-button").on("click", SendLoginAttempt);
	$("#username").on("keypress", SendLoginAttempt);
	$("#password").on("keypress", SendLoginAttempt);
}

function SendLoginAttempt(e) {
	if(e.type == "keypress" && e.which != 13) return;

	var data = {
		user:$("#username").val().toLowerCase(),
		pass:$("#password").val()
	};
	socket.emit('login_attempt', data);
	return false;
}

function InitPixi() {
	renderer = PIXI.autoDetectRenderer(960, 720, {
		antialias:false,
		transparent:false,
		resolution:1
	});
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();

	loadingScreen = new PIXI.Container();
	loadingScreen.visible = false;
	stage.addChild(loadingScreen);

	charSelectionScreen = new PIXI.Container();
	charSelectionScreen.visible = false;
	stage.addChild(charSelectionScreen);

	charCreationScreen = new PIXI.Container();
	charCreationScreen.visible = false;
	stage.addChild(charCreationScreen);

	houseScreen = new PIXI.Container();
	houseScreen.visible = false;
	stage.addChild(houseScreen);

	mapScreen = new PIXI.Container();
	mapScreen.visible = false;
	stage.addChild(mapScreen);

	dungeonScreen = new PIXI.Container();
	dungeonScreen.visible = false;
	stage.addChild(dungeonScreen);

	InitInput();

	state = function() {};
	update();
}

function update() {
	requestAnimationFrame(update);
	keyboard.update();
	mouse.update();
	state();
	renderer.render(stage);
}

function CharCreationScreen() {

}

function HouseScreen() {

}

function MapScreen() {

}