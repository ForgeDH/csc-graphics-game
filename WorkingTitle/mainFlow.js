/* GLOBAL CONSTANTS AND VARIABLES */
var GAME_WINDOW_HEIGHT = 600;
var GAME_WINDOW_WIDTH = 1000;
var GAME = {};
var activeScene;
var BASE_URL = "https://raw.githubusercontent.com/ForgeDH/csc-graphics-game/master/WorkingTitle/";

var resources = {};

GAME.allObjects = [];			// everything in the world
GAME.entities = [];				// things that need processing every tick (player, enemies, projectiles, etc.)
GAME.structures = [];			// things that are static (walls, floors, etc.)

GAME.player = {};

/* ARENA FILE STRUCTURE */
var Arena1 = ["floor1.json"];
var ARENAS = {"Arena1":Arena1};

/* ENTITY FILE STRUCTURE */
var OBJECTS = {};
var ENEMIES = {"enemy1":"enemy1.json"};

/* MAIN -- HERE is where execution begins after window load */
function main() {

	// add entities (all for now)
	for (var arena in ARENAS){
		for (var obj in ARENAS[arena]){
			// TODO SWITCH OFF OF ENTITIES
			load(BASE_URL + 'Arenas/' + arena + '/' + ARENAS[arena][obj],ARENAS[arena][obj]);
		}
	}
	for (var obj in OBJECTS){
		load(BASE_URL + 'Entities/Objects/' + obj + '/' + OBJECTS[obj],OBJECTS[obj]);
	}
	for (var enemy in ENEMIES){
		load(BASE_URL + 'Entities/Enemies/' + enemy + '/' + ENEMIES[enemy],ENEMIES[enemy]);
	}
	load(BASE_URL + 'Entities/Objects/object1/object1.json', 'object1.json');//load player



	// create THREE renderer and put it in the webpage
	GAME.renderer = new THREE.WebGLRenderer();
  GAME.renderer.autoClear = false;
	GAME.renderer.setSize( GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT );
	document.body.appendChild( GAME.renderer.domElement );
	
	activeScene = new Scene(menuSceneInit, menuSceneLoop);
	
	function render() {
		requestAnimationFrame( render );
		
		activeScene.runningLoop();
	}
	
	INPUT.init();
	render();
	
} // end main

function load(JSONurl, name) {

  function getJSONFile(url) {
		try {
				if (typeof(url) !== "string")
						throw "getJSONFile: parameter not a string";
				else {
						var httpReq = new XMLHttpRequest(); // a new http request
						httpReq.open("GET",url,false); // init the request
						httpReq.send(null); // send the request
						var startTime = Date.now();
						while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
								if ((Date.now()-startTime) > 3000)
										break;
						} // until its loaded or we time out after three seconds
						return JSON.parse(httpReq.response); 
				} // end if good params
		} // end try    
		
		catch(e) {
				console.log(e);
				return(String.null);
		}
	} 
	
	// load JSON
	var JSONobj = getJSONFile(JSONurl);
	resources[name] = JSONobj;
	
	// load texture
	if(JSONobj.textureURL != ""){
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};
		
		resources[name+"texture"] = new THREE.Texture();
		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};
		var onError = function ( xhr ) {
		};

		var loader = new THREE.ImageLoader( manager );
		loader.setCrossOrigin("anonymous");
		loader.load( JSONobj.textureURL, function ( image ) {
			resources[name+"texture"].image = image;
			resources[name+"texture"].needsUpdate = true;
		} );
	}
	
	var loader = new THREE.OBJLoader();
	loader.load(JSONobj.modelURL, function (object) {
		object.traverse(function (child) {
						if (child instanceof THREE.Mesh) {
							if(resources[name+"texture"]){
								child.material.map = resources[name+"texture"];
							} else {
								child.material = new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0xdddddd, shininess: 30, shading: THREE.FlatShading});;
							}
							resources[name+"mesh"] = child;
						}
				}.bind(this));
	}.bind(this));
	
}
