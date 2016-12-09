var gameOverSceneInit = function(){
  
  //get Doom Background Image
  this.gameOverImage = document.getElementById("gameOverImage");
  this.crosshair = document.getElementById("crosshair1");
  
  ssinit.bind(this)();
};


var gameOverSceneLoop = function(){
  ssloop.bind(this)(this.gameOverImage);
};

var controlsSceneInit = function(){
  
  //get Doom Background Image
  this.controlsImage = document.getElementById("controlsImage");
  this.crosshair = document.getElementById("crosshair1");
  
  ssinit.bind(this)();
};


var controlsSceneLoop = function(){
  ssloop.bind(this)(this.controlsImage);
}

var creditsSceneInit = function(){
  
  //get Doom Background Image
  this.creditsImage = document.getElementById("creditsImage");
  this.crosshair = document.getElementById("crosshair1");
  
  ssinit.bind(this)();
};


var creditsSceneLoop = function(){
  ssloop.bind(this)(this.creditsImage);
}

var ssinit = function() {
  this.buttons = [{x: 0, y: 0, w: 1000, h: 600, action: function(){activeScene = new Scene(menuSceneInit, menuSceneLoop);}}
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
};

var ssloop = function(img) {
  // Update HUD graphics.
  this.hudBitmap.clearRect(0, 0, GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT);
  this.hudBitmap.drawImage(img, 0, 0, GAME_WINDOW_WIDTH, GAME_WINDOW_HEIGHT);
  
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
