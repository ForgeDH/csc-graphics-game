/* GLOBAL CONSTANTS AND VARIABLES */
var GAME = {};
var activeScene;
var BASE_URL = "https://raw.githubusercontent.com/ForgeDH/csc-graphics-game/master/WorkingTitle/";

GAME.allObjects = [];			// everything in the world
GAME.entities = [];				// things that need processing every tick (player, enemies, projectiles, etc.)
GAME.structures = [];			// things that are static (walls, floors, etc.)

GAME.player;

/* ARENA FILE STRUCTURE */
var Arena1 = ["floor1.json"];
var ARENAS = {"Arena1":Arena1};

/* ENTITY FILE STRUCTURE */
var OBJECTS = {};
var ENEMIES = {};

/* MAIN -- HERE is where execution begins after window load */

function main() {
	activeScene = new Scene(gameSceneInit, gameSceneLoop);
	
	function render() {
		requestAnimationFrame( render );
		
		activeScene.runningLoop();
	}
	
	INPUT.init();
	render();
	
} // end main