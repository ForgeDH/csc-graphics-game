/* GLOBAL CONSTANTS AND VARIABLES */
var GAME = {};

GAME.allObjects = [];			// everything in the world
GAME.entities = [];				// things that need processing every tick (player, enemies, projectiles, etc.)
GAME.structures = [];			// things that are static (walls, floors, etc.)

GAME.player;


/* INPUTS */

/* MAIN -- HERE is where execution begins after window load */

function main() {
  
	// create THREE scene and camera
	GAME.scene = new THREE.Scene();
	GAME.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// create THREE renderer and put it in the webpage
	GAME.renderer = new THREE.WebGLRenderer();
	GAME.renderer.setSize( window.innerWidth * 0.9, window.innerHeight * 0.9 );
	document.body.appendChild( GAME.renderer.domElement );

	// create CANNON world
	GAME.world = new CANNON.World();
	GAME.world.gravity.set(0,-1,0);
	GAME.world.broadphase = new CANNON.NaiveBroadphase();
	
	/*
	// create THREE file loading manager
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};

	// create a box
	var cube = {};
	entities.push(cube);
	
	// properties
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube.mesh = new THREE.Mesh( geometry, material );
	cube.mesh.position.y = 5;
	//physics
	var boxShape = new CANNON.Box(new CANNON.Vec3(1,1,1));
	cube.body = new CANNON.Body({mass: 1, shape: boxShape});
	cube.body.position.set(cube.mesh.position.x, cube.mesh.position.y, cube.mesh.position.z);
	world.add(cube.body);
	
	scene.add( cube.mesh );

	// load the test floor
	var loader = new THREE.OBJLoader();
	var material = new THREE.MeshBasicMaterial({color: 'gray', side: THREE.DoubleSide});
	loader.load('https://raw.githubusercontent.com/ForgeDH/csc-graphics-game/master/WorkingTitle/plate.obj', function (object) {
		object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.material = material;
            }
        });
		object.rotation.x = 0;
		scene.add(object);
		});
		//physics
		boxShape = new CANNON.Box(new CANNON.Vec3(100,0.5,100));
		var floorBody = new CANNON.Body({mass: 0, shape: boxShape});
		world.add(floorBody);
		*/
		
	GAME.entities.push(new Entity('https://raw.githubusercontent.com/ForgeDH/csc-graphics-game/master/WorkingTitle/Arenas/Arena1/Floors/floor1.json'));
	console.log(GAME.entities);
	
	GAME.camera.position.y = 5;
	GAME.camera.position.z = 10;
	function render() {
		requestAnimationFrame( render );
		
		//handle input
		while (INPUT.eventsToHandle() == true){
			console.log(INPUT.getNextEvent());
		}
		
		for (var idx in GAME.entities){
			GAME.entities[idx].updateMeshToBody();
		}
		
		GAME.world.step(0.1666);
		GAME.renderer.render( GAME.scene, GAME.camera );
	}
	
	INPUT.init();
	render();
} // end main