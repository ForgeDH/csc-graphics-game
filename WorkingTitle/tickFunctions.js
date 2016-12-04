var tickFunctions = {};

tickFunctions.noTick = function(){
};

tickFunctions.boxTick = function(){
	// POSITION
	var ms = 0.5;
	if(INPUT.isKeyDown("w")){
		this.body.velocity.z -= ms;
	}
	if(INPUT.isKeyDown("s")){
		this.body.velocity.z += ms;
	}
	if(INPUT.isKeyDown("a")){
		this.body.velocity.x -= ms;
	}
	if(INPUT.isKeyDown("d")){
		this.body.velocity.x += ms;
	}
	
	//GAME.camera.position.x = this.body.position.x;
	//GAME.camera.position.y = this.body.position.y+2;
	//GAME.camera.position.z = this.body.position.z+5;
	
	// ROTATION	
	if(this.mesh.pitchObj !== undefined){
		this.mesh.pitchObj.rotation.x -= INPUT.getMouseYChange()/100;
		this.mesh.yawObj.rotation.y -= INPUT.getMouseXChange()/100;
	}
}