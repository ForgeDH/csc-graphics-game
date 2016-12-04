class Scene{
	constructor(initFunc, loopFunc){
		initFunc();
		this.runningLoop = loopFunc;
	}
	
}

var menuSceneInit = function(){
	
}

var menuSceneLoop = function(){
	
}

var gameSceneInit = function(){
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
	
	// add entities (all for now)
	for (var arena in ARENAS){
		for (var obj in ARENAS[arena]){
			// TODO SWITCH OFF OF ENTITIES
			GAME.entities.push(new Entity(BASE_URL + 'Arenas/' + arena + '/' + ARENAS[arena][obj]));
		}
	}
	for (var obj in OBJECTS){
		GAME.entities.push(new Entity(BASE_URL + 'Entities/Objects/' + obj + '/' + OBJECTS[obj]));
	}
	for (var enemy in ENEMIES){
		GAME.entities.push(new Entity(BASE_URL + 'Entities/Enemies/' + enemy + '/' + ENEMIES[enemy]));
	}
	console.log(GAME.entities);
	
	// load player
	GAME.player = new Entity(BASE_URL + 'Entities/Objects/object1/object1.json', true);
	GAME.entities.push(GAME.player);
}

var gameSceneLoop = function(){
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