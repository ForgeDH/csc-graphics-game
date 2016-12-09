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
  
  this.buttons = [{x: 485, y: 130, w: 225, h: 60, action: function(){activeScene = new Scene(gameSceneInit, gameSceneLoop);}},
                  {x: 373, y: 263, w: 450, h: 62, action: function(){alert("not yet implemented");}},
                  {x: 392, y: 395, w: 415, h: 60, action: function(){activeScene = new Scene(controlsSceneInit, controlsSceneLoop);}},
                  {x: 900, y: 600, w: 100, h: 50, action: function(){activeScene = new Scene(creditsSceneInit, creditsSceneLoop);}}
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
  }
  this.hudBitmap.drawImage(this.crosshair, INPUT.getMouseX()-32, INPUT.getMouseY()-32);
	this.hudTexture.needsUpdate = true;
  // Render HUD on top of the scene.
  GAME.renderer.render(this.sceneHUD, this.cameraHUD);
	
	//handle input
	while (INPUT.eventsToHandle() == true){
		//console.log(INPUT.getNextEvent());
		if(INPUT.getNextEvent().type=="mousedown" && document.pointerLockElement) { //only fire if pointer is locked
		  for(var i = 0; i < this.buttons.length; i++) {
		    if(INPUT.getMouseX() >= this.buttons[i].x && INPUT.getMouseX() < this.buttons[i].x+this.buttons[i].w && 
   		     INPUT.getMouseY() >= this.buttons[i].y && INPUT.getMouseY() < this.buttons[i].y+this.buttons[i].h) {
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
	GAME.weapons = [];

	GAME.globalTimer = 0;
	GAME.spawnRate = 3600;
	GAME.spawnInc = 5;

  // create THREE scene, light and camera
	GAME.scene = new THREE.Scene();
	var light = new THREE.PointLight( 0xffffff, 1, 10000 );
	light.position.set( 50, 50, 50 );
  if (navigator.appVersion.indexOf("Mac")!=-1)
    light.position.y *= -1;
  GAME.scene.add( light );
	
	var ambientLight = new THREE.AmbientLight( 0x555555, 0.5 );
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
			var entityCreated = new Entity(ARENAS[arena][obj]);
			GAME.entities.push(entityCreated);
			setTimeout(function(){addEntity(this)}.bind(entityCreated),100);
		}
	}
	for (var obj in OBJECTS){
		GAME.entities.push(new Entity(OBJECTS[obj]));
	}
	for (var weapon in WEAPONS){
		GAME.weapons.push(new Weapon(WEAPONS[weapon]));
	}
	console.log(GAME.weapons);
	// load player
	GAME.player = new Entity('object1.json', true);
	Entity.initPlayer();
	setTimeout(function(){addEntity(GAME.player)}, 100);
	GAME.entities.push(GAME.player);
	/*
	for (var enemy in ENEMIES){
	  for(var i = 0; i < 20; i++) {
	    var newEnemy = new Entity(ENEMIES[enemy]);
		  GAME.entities.push(newEnemy);
		  addEntity(newEnemy);
		}
	}*/
	
	// load player
	/*
	GAME.player = new Entity('object1.json', true);
	Entity.initPlayer();
	setTimeout(function(){addEntity(GAME.player)}, 100);
	GAME.entities.push(GAME.player);*/
	
  /************************************************************************
  ** SETUP FOR UI
  ** CODE MODIFIED FROM: http://www.evermade.fi/en/pure-three-js-hud/
  ************************************************************************/
  
  
  //get Watson Face Image
  this.watsons = [document.getElementById("watson25"),
                  document.getElementById("watson50"),
                  document.getElementById("watson75"),
                  document.getElementById("watson100")];
  //get other images
  this.HUDimg = document.getElementById("HUDimgBack");

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
	
	if(GAME.globalTimer % GAME.spawnRate == 0){
		console.log("NEW WAVE");
		for (var enemy in ENEMIES){
			for(var i = 0; i < (10 + (GAME.globalTimer / GAME.spawnRate) * GAME.spawnInc) ; i++) {
				var newEnemy = new Entity(ENEMIES[enemy]);
				GAME.entities.push(newEnemy);
				addEntity(newEnemy);
			}
		}
	}
	
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
	for (var idx in GAME.weapons){
		GAME.weapons[idx].tick();
	}
	
	GAME.world.step(0.1666);
	GAME.renderer.render( GAME.scene, GAME.camera );
	
	
  // Update HUD graphics.
  this.hudBitmap.clearRect(0, 0, GAME_WINDOW_WIDTH, window.GAME_WINDOW_HEIGHT);
  
  // Whole box
	this.hudBitmap.strokeStyle = 'rgba(0,0,0,1.0)';     //Outline Black
	
  this.hudBitmap.drawImage(this.HUDimg, 0, 500); //Whole panel
  
  //Weapon rectangles
  this.hudBitmap.strokeRect(254, 504, 139, 71);       // weapon rects
  this.hudBitmap.strokeRect(393, 504, 139, 71);
  this.hudBitmap.strokeRect(532, 504, 139, 71);
  this.hudBitmap.strokeRect(254, 575, 139, 71);
  this.hudBitmap.strokeRect(393, 575, 139, 71);
  this.hudBitmap.strokeRect(532, 575, 139, 71);
  
  //Weapon Images
  //TODO
  
  //Weapon numbers
/*this.hudBitmap.fillStyle = 'rgba(0,  0,  0,  1.0)';
  this.hudBitmap.font = '16px serif';
  this.hudBitmap.fillText('1', 256, 564);             //Weapon numbers
  this.hudBitmap.fillText('2', 395, 564);
  this.hudBitmap.fillText('3', 534, 564);
  this.hudBitmap.fillText('4', 256, 635);
  this.hudBitmap.fillText('5', 395, 635);
  this.hudBitmap.fillText('6', 534, 635);
  //Obsoleted by new back img*/
  
  //Weapon cooldowns
	this.hudBitmap.fillStyle = 'rgba(250,250,0  ,1.0)'; //Fill Yellow
  if(GAME.weapons[0]) this.hudBitmap.fillRect(255, 570, 137 * GAME.weapons[0].currCD / GAME.weapons[0].cooldown, 4);       // weapon cooldowns [NYI]
  if(GAME.weapons[1]) this.hudBitmap.fillRect(394, 570, 137 * GAME.weapons[1].currCD / GAME.weapons[1].cooldown, 4);
  if(GAME.weapons[2]) this.hudBitmap.fillRect(533, 570, 137 * GAME.weapons[2].currCD / GAME.weapons[2].cooldown, 4);
  if(GAME.weapons[3]) this.hudBitmap.fillRect(255, 641, 137 * GAME.weapons[3].currCD / GAME.weapons[3].cooldown, 4);
  if(GAME.weapons[4]) this.hudBitmap.fillRect(394, 641, 137 * GAME.weapons[4].currCD / GAME.weapons[4].cooldown, 4);
  if(GAME.weapons[5]) this.hudBitmap.fillRect(533, 641, 137 * GAME.weapons[5].currCD / GAME.weapons[5].cooldown, 4);
  
  //Ammo Icons
  //TODO
  //4 504:   Ammo Icon A 32 32    //Ammo icons
  //4 541:   Ammo Icon B 32 32
  //4 577:   Ammo Icon C 32 32
  //4 614:   Ammo Icon D 32 32
  
  //Ammo Counts [NYI]
  this.hudBitmap.fillStyle = 'rgba(0,  0,  0,  1.0)';
  this.hudBitmap.font = '16px serif';
  
  
  //Health bar
  //this.hudBitmap.fillStyle = 'rgba(0,  0,  0,  1.0)'; //Fill Black //Obsoleted by back img
  this.hudBitmap.fillRect(780, 560, 200, 40);
  this.hudBitmap.fillStyle = 'rgba(0,255,  0,  1.0)'; //Fill Green
  
  var healthBar = 740 + GAME.player.currentHealth/100 * 240;
  
  this.hudBitmap.beginPath();                                     //Begin Path
  this.hudBitmap.moveTo(780, 560);                                //Move To 780 560
  this.hudBitmap.lineTo(Math.min(980, healthBar + 40),560);       //Move To MAX(980, 800+200*Health%) 560
  if(GAME.player.currentHealth > 83) {
    this.hudBitmap.lineTo(980, 560 + (40 * (GAME.player.currentHealth-83) / 17));
  }
  if(GAME.player.currentHealth < 17) {
    this.hudBitmap.lineTo(780, 560 + (40 * GAME.player.currentHealth / 17));
  }
  this.hudBitmap.lineTo(Math.max(780, healthBar),600);      //Move To MIN(780, 760+200*Health%) 600
  this.hudBitmap.lineTo(780, 600);                                //Move To 780 560
  this.hudBitmap.closePath();                                     //Close path
  this.hudBitmap.fill();                                          //Fill
  
  //FACE
  this.hudBitmap.drawImage(this.watsons[Math.floor((GAME.player.currentHealth - 1)/25)], 680, 505); //680 505: Watson Image 100 140 

  // Reticule
  this.hudBitmap.strokeStyle = 'rgba(255,255,255,1.0)';
  this.hudBitmap.strokeRect(GAME_WINDOW_WIDTH/2-2 , window.GAME_WINDOW_HEIGHT/2-2, 5, 5);

  
	this.hudTexture.needsUpdate = true;
  // Render HUD on top of the scene.
  GAME.renderer.render(this.sceneHUD, this.cameraHUD);
	GAME.globalTimer += 1;
}
