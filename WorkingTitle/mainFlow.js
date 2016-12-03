/* GLOBAL CONSTANTS AND VARIABLES */
var GAME = {};
var BASE_URL = "https://raw.githubusercontent.com/ForgeDH/csc-graphics-game/master/WorkingTitle/";

GAME.allObjects = [];			// everything in the world
GAME.entities = [];				// things that need processing every tick (player, enemies, projectiles, etc.)
GAME.structures = [];			// things that are static (walls, floors, etc.)

GAME.player;



/* ARENA FILE STRUCTURE */
var Arena1 = ["floor1.json"];
var ARENAS = {"Arena1":Arena1};

/* ENTITY FILE STRUCTURE */
var OBJECTS = ["object1.json"]
var ENEMIES = [];
var ENTITIES = {"Enemies":ENEMIES, "Objects":OBJECTS};

/* MAIN -- HERE is where execution begins after window load */

function main() {
  
	// create THREE scene, light and camera
	GAME.scene = new THREE.Scene();
	var light = new THREE.PointLight( 0xffffff, 1, 10000 );
	light.position.set( 50, 50, 50 );
	GAME.scene.add( light );
	GAME.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// create THREE renderer and put it in the webpage
	GAME.renderer = new THREE.WebGLRenderer();
	GAME.renderer.setSize( window.innerWidth * 0.9, window.innerHeight * 0.9 );
	document.body.appendChild( GAME.renderer.domElement );

	// create CANNON world
	GAME.world = new CANNON.World();
	GAME.world.gravity.set(0,-1,0);
	GAME.world.broadphase = new CANNON.NaiveBroadphase();

	// add entities manually
	//GAME.entities.push(new Entity(BASE_URL + 'Arenas/Arena1/Floors/floor1.json'));
	//GAME.entities.push(new Entity(BASE_URL + 'Entities/Objects/Object1/Object1.json'));
	
	// add entities (all for now)
	for (var arena in ARENAS){
		for (var obj in ARENAS[arena]){
			console.log(BASE_URL + 'Arenas/' + arena + '/' + ARENAS[arena][obj]);
			GAME.entities.push(new Entity(BASE_URL + 'Arenas/' + arena + '/' + ARENAS[arena][obj]));
		}
	}
	for (var entity in ENTITIES){
		for (var obj in OBJECTS){
			console.log(BASE_URL + 'Entities/Objects/' + obj + '/' + ENTITIES[entity][obj]);
			GAME.entities.push(new Entity(BASE_URL + 'Entities/Objects/' + obj + '/' + ENTITIES[entity][obj]));
		}
		for (var enemy in ENEMIES){
			console.log(BASE_URL + 'Entities/Enemies/' + enemy + '/' + ENTITIES[entity][enemy]);
			GAME.entities.push(new Entity(BASE_URL + 'Entities/Enemies/' + enemy + '/' + ENTITIES[entity][enemy]));
		}
	}
	console.log(GAME.entities);
	
	GAME.camera.position.y = 5;
	GAME.camera.position.z = 10;
	function render() {
		requestAnimationFrame( render );
		
		//handle input
		while (INPUT.eventsToHandle() == true){
			//console.log(INPUT.getNextEvent());
			INPUT.getNextEvent();
		}
		
		for (var idx in GAME.entities){
			GAME.entities[idx].tick();
			GAME.entities[idx].updateMeshToBody();
		}
		
		GAME.world.step(0.1666);
		GAME.renderer.render( GAME.scene, GAME.camera );
	}
	
	INPUT.init();
	render();
} // end main