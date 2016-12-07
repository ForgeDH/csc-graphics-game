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
  this.hudCanvas.width = GAME_WINDOW_WIDTH;
  this.hudCanvas.height = GAME_WINDOW_HEIGHT;

  // Get 2D context and draw something supercool.
  this.hudBitmap = this.hudCanvas.getContext('2d');
     
  // Create the camera and set the viewport to match the screen dimensions.
  this.cameraHUD = new THREE.OrthographicCamera(-GAME_WINDOW_WIDTH/2, GAME_WINDOW_WIDTH/2, GAME_WINDOW_HEIGHT/2, -GAME_WINDOW_HEIGHT/2, 0, 30 );

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
  var planeGeometry = new THREE.PlaneGeometry( GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT );
  var plane = new THREE.Mesh( planeGeometry, material );
  this.sceneHUD.add( plane );
}

var menuSceneLoop = function(){
  // Update HUD graphics.
  this.hudBitmap.clearRect(0, 0, GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT);
  this.hudBitmap.drawImage(this.doomArt, 0, 0, GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT);
  
	this.hudBitmap.font = "Bold 40px Arial";
  this.hudBitmap.textAlign = 'center';
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

var addEntity = function(entity){
	GAME.scene.add(entity.mesh.parent);
	GAME.world.add(entity.body);
}

var gameSceneInit = function(){
  //clear the previous setting
  GAME.allObjects = [];
  GAME.entities = [];
  GAME.structures = [];
	GAME.enemies = [];


  // create THREE scene, light and camera
	GAME.scene = new THREE.Scene();
	var light = new THREE.PointLight( 0xffffff, 1, 10000 );
	light.position.set( 50, 50, 50 );
	GAME.scene.add( light );
	
	var ambientLight = new THREE.AmbientLight( 0x00ff00, 0.5 );
	GAME.scene.add( ambientLight );
	
	GAME.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


	// create CANNON world
	GAME.world = new CANNON.World();
	GAME.world.gravity.set(0,-1,0);
	GAME.world.broadphase = new CANNON.NaiveBroadphase();
	
	GAME.world.defaultContactMaterial.friction = 0; //no friction - prevents hopping behavior
	
	// add entities (all for now)
	for (var arena in ARENAS){
		for (var obj in ARENAS[arena]){
			// TODO SWITCH OFF OF ENTITIES
			GAME.entities.push(new Entity(ARENAS[arena][obj]));
			setTimeout(function(){addEntity(GAME.entities[0])},100);
		}
	}
	for (var obj in OBJECTS){
		GAME.entities.push(new Entity(OBJECTS[obj]));
	}
	for (var enemy in ENEMIES){
	  for(var i = 0; i < 20; i++) {
	    var newEnemy = new Entity(ENEMIES[enemy]);
		  GAME.entities.push(newEnemy);
		  addEntity(newEnemy);
		}
	}
	
	// load player
	GAME.player = new Entity('object1.json', true);
	Entity.initPlayer();
	setTimeout(function(){addEntity(GAME.player)}, 100);
	GAME.entities.push(GAME.player);
	
  /************************************************************************
  ** SETUP FOR UI
  ** CODE MODIFIED FROM: http://www.evermade.fi/en/pure-three-js-hud/
  ************************************************************************/

	// Ok, now we have the cube. Next we'll create the hud. For that we'll
  // need a separate scene which we'll render on top of our 3D scene. We'll
  // use a dynamic texture to render the HUD.
  
  // We will use 2D canvas element to render our HUD.
	this.hudCanvas = document.createElement('canvas');
  
  // Again, set dimensions to fit the screen.
  this.hudCanvas.width = GAME_WINDOW_WIDTH;
  this.hudCanvas.height = GAME_WINDOW_HEIGHT;

  // Get 2D context and draw something supercool.
  this.hudBitmap = this.hudCanvas.getContext('2d');
     
  // Create the camera and set the viewport to match the screen dimensions.
  this.cameraHUD = new THREE.OrthographicCamera(-GAME_WINDOW_WIDTH/2, GAME_WINDOW_WIDTH/2, GAME_WINDOW_HEIGHT/2, -GAME_WINDOW_HEIGHT/2, 0, 30 );

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
  var planeGeometry = new THREE.PlaneGeometry( GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT );
  var plane = new THREE.Mesh( planeGeometry, material );
  this.sceneHUD.add( plane );
}

var gameSceneLoop = function(){
	//handle input
	var inputList = [];
	while (INPUT.eventsToHandle() == true){
		//console.log(INPUT.getNextEvent());
		inputList.push(INPUT.getNextEvent());
	}
	for (var idx in GAME.entities){
		if(GAME.entities[idx] === GAME.player){
			GAME.entities[idx].tick(inputList);
		} else{
			GAME.entities[idx].tick();
		}
		GAME.entities[idx].updateMeshToBody();
	}
	
	GAME.world.step(0.1666);
	GAME.renderer.render( GAME.scene, GAME.camera );
	
	
  // Update HUD graphics.
  this.hudBitmap.clearRect(0, 0, GAME_WINDOW_WIDTH, window.GAME_WINDOW_HEIGHT);
  
	//Outline Black
  //Fill Grey
  //0 500: Rect 1000 150          // whole thing
  //254 504: Rect 139 71          // weapon rect
  //393 504: Rect 139 71
  //532 504: Rect 139 71
  //254 575: Rect 139 71
  //393 575: Rect 139 71
  //532 575: Rect 139 71
  //                              //TODO: weapon numbers
  //4 504:   Ammo Icon A 32 32    //Ammo icons
  //4 541:   Ammo Icon B 32 32
  //4 577:   Ammo Icon C 32 32
  //4 614:   Ammo Icon D 32 32
  //Fill Black
  //780 560: Rect 200 40
  //Fill Green
  //Begin Path
  //Move To 780 560
  //Move To MAX(980, 800+200*Health%) 560
  //Move To MIN(780, 760+200*Health%) 600
  //Close Path
  //Fill
  //680 505: Watson Image 100 140 //FACE
	this.hudTexture.needsUpdate = true;
  // Render HUD on top of the scene.
  GAME.renderer.render(this.sceneHUD, this.cameraHUD);
}