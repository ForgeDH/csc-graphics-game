class Scene{
	constructor(initFunc, loopFunc){
		initFunc.bind(this)();
		this.runningLoop = loopFunc;
	}
	
}

var menuSceneInit = function(){
  
  //get Doom Background Image
  this.doomArt = document.getElementById("doomArt");
  this.crosshair = document.getElementById("crosshair1");
  
  this.buttons = [{x: 500, y: 400, w: 300, h: 100, action: function(){activeScene = new Scene(gameSceneInit, gameSceneLoop);}},
                  ];
  
  /************************************************************************
  ** CODE MODIFIED FROM: http://www.evermade.fi/en/pure-three-js-hud/
  ************************************************************************/

	// Ok, now we have the cube. Next we'll create the hud. For that we'll
  // need a separate scene which we'll render on top of our 3D scene. We'll
  // use a dynamic texture to render the HUD.
  
  // We will use 2D canvas element to render our HUD.
	this.hudCanvas = document.createElement('canvas');
  
  // Again, set dimensions to fit the screen.
  this.hudCanvas.width = window.innerWidth * 0.9;
  this.hudCanvas.height = window.innerHeight * 0.9;

  // Get 2D context and draw something supercool.
  this.hudBitmap = this.hudCanvas.getContext('2d');
	this.hudBitmap.font = "Bold 40px Arial";
  this.hudBitmap.textAlign = 'center';
  this.hudBitmap.fillStyle = "rgba(245,245,245,1.0)";
     
  // Create the camera and set the viewport to match the screen dimensions.
  this.cameraHUD = new THREE.OrthographicCamera(-window.innerWidth*0.9/2, window.innerWidth*0.9/2, window.innerHeight*0.9/2, -window.innerHeight*0.9/2, 0, 30 );

  // Create also a custom scene for HUD.
  this.sceneHUD = new THREE.Scene();
 
	// Create texture from rendered graphics.
  this.hudTexture = new THREE.Texture(this.hudCanvas);
  this.hudTexture.generateMipmaps = false;
  this.hudTexture.minFilter = THREE.LinearFilter;
  this.hudTexture.magFilter = THREE.LinearFilter;
  this.hudTexture.needsUpdate = true;
  
  // Create HUD material.
  var material = new THREE.MeshBasicMaterial( {map: this.hudTexture} );
  material.transparent = true;

  // Create plane to render the HUD. This plane fill the whole screen.
  var planeGeometry = new THREE.PlaneGeometry( window.innerWidth*0.9, window.innerHeight*0.9 );
  var plane = new THREE.Mesh( planeGeometry, material );
  this.sceneHUD.add( plane );
  
  
  console.log(this);
}

var menuSceneLoop = function(){
  // Update HUD graphics.
  this.hudBitmap.clearRect(0, 0, window.innerWidth*0.9, window.innerHeight*0.9);
  this.hudBitmap.drawImage(this.doomArt, 0, 0, window.innerWidth * 0.9, window.innerHeight * 0.9);
  for(var i = 0; i < this.buttons.length; i++) {
    this.hudBitmap.fillStyle = "rgba(245,245,245,0.7)";
    this.hudBitmap.fillRect(this.buttons[i].x,this.buttons[i].y,this.buttons[i].w,this.buttons[i].h);
    this.hudBitmap.fillStyle = "rgba(0,0,0,1.0)";
    this.hudBitmap.fillText("DELEELELELE", this.buttons[i].x + this.buttons[i].w / 2, this.buttons[i].y + this.buttons[i].h / 2);
  }
  this.hudBitmap.drawImage(this.crosshair, INPUT.getMouseX()-32, INPUT.getMouseY()-32);
	this.hudTexture.needsUpdate = true;

  // Render HUD on top of the scene.
  GAME.renderer.render(this.sceneHUD, this.cameraHUD);
  
	//handle input
	while (INPUT.eventsToHandle() == true){
		//console.log(INPUT.getNextEvent());
		if(INPUT.getNextEvent().type=="mousedown") {
		  for(var i = 0; i < this.buttons.length; i++) {
		    if(INPUT.getMouseX() >= this.buttons[i].x && INPUT.getMouseX() < this.buttons[i].x+this.buttons[i].w) {
		      this.buttons[i].action();
		    }
		  }
		}
	}
}

var gameSceneInit = function(){
		// create THREE scene, light and camera
	GAME.scene = new THREE.Scene();
	var light = new THREE.PointLight( 0xffffff, 1, 10000 );
	light.position.set( 50, 50, 50 );
	GAME.scene.add( light );
	GAME.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


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
