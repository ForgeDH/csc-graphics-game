/*

How to use

For each tick, call getNextEvent until eventsToHandle is false, and handle the event.
  It will be of one of the following event types:
    mousedown
    mouseup
    keydown
    keyup

To get the state of a key, call INPUT.isKeyDown(s) where s is the key as a string (a s d f 1 2 3 4 ArrowUp ArrowDown ArrowLeft ArrowRight)
To test a key's name, use document.onkeydown = function(e) {console.log(e.key);} in the js console.

To get the state of a mouse button, call INPUT.isLeftButtonDown() or INPUT.isRightButtonDown().
To get the location of the mouse, call INPUT.getMouseX and INPUT.getMouseY.
To get the amount the mouse has moved, call INPUT.getMouseXChange and INPUT.getMouseYChange.  These methods return the amount the mouse has moved since they were last called.

*/

var INPUT = {
  state: new Map(),
  rButton: false,
  lButton: false,
  queue: [],
  mouseX: 0,
  mouseY: 0,
  mouseChangeSinceLastGetX: 0,
  mouseChangeSinceLastGetY: 0,
  isKeyDown: function(s) {
    return INPUT.state.get(s);
  },
  isLeftButtonDown: function(s) {
    return INPUT.lButton;
  },
  isRightButtonDown: function(s) {
    return INPUT.rButton;
  },
  eventsToHandle: function() {
    return INPUT.queue.length > 0;
  },
  getNextEvent: function() {
    return INPUT.queue.shift();
  },
  getMouseX: function() {
    return INPUT.mouseX;
  },
  getMouseY: function() {
    return INPUT.mouseY;
  },
  getMouseXChange: function() {
    var temp = INPUT.mouseChangeSinceLastGetX;
    INPUT.mouseChangeSinceLastGetX = 0;
    return temp;
  },
  getMouseYChange: function() {
    var temp = INPUT.mouseChangeSinceLastGetY;
    INPUT.mouseChangeSinceLastGetY = 0;
    return temp;
  },
  init: function() {
    INPUT.queue = [];
	
	/**********************************************************************************
	CODE MODIFIED FROM https://github.com/mdn/pointer-lock-demo/blob/gh-pages/app.js
	**********************************************************************************/
	document.querySelector('canvas').onclick = function(event) {
	  INPUT.mouseX = event.offsetX;
	  INPUT.mouseY = event.offsetY;
	  document.querySelector('canvas').requestPointerLock();
	};

	// pointer lock event listeners

	// Hook pointer lock state change events for different browsers
	document.addEventListener('pointerlockchange', function() {
	  if (document.pointerLockElement === document.querySelector('canvas') ||
		  document.mozPointerLockElement === document.querySelector('canvas')) {
		document.addEventListener("mousemove", __updatePosition, false);
	  } else {
		document.removeEventListener("mousemove", __updatePosition, false);
	  }
	}, false);

	function __updatePosition(e) {
	  INPUT.mouseX += e.movementX;
	  INPUT.mouseY += e.movementY;
	  INPUT.mouseChangeSinceLastGetX += e.movementX;
	  INPUT.mouseChangeSinceLastGetY += e.movementY;
	}
  }
};

document.addEventListener("keydown", 
  function(event) {
		if(!INPUT.isKeyDown(event.key)){
			event.eventType = "keydown";
			INPUT.queue.push(event);
			INPUT.state.set(event.key, true);
		}
  }
);

document.addEventListener("keyup", 
  function(event) {
		event.eventType = "keyup";
    INPUT.queue.push(event);
    INPUT.state.set(event.key, false);
  }
);

document.addEventListener("mousedown",
  function(event) {
		event.eventType = "mousedown";
    INPUT.queue.push(event);
    if(event.button == 0)
      INPUT.lButton = true;
    else if(event.button == 2)
      INPUT.rButton = true;
  }
);

document.addEventListener("mouseup",
  function(event) {
		event.eventType = "mouseup";
    INPUT.queue.push(event);
    if(event.button == 0)
      INPUT.lButton = false;
    else if(event.button == 2)
      INPUT.rButton = false;
  }
);

