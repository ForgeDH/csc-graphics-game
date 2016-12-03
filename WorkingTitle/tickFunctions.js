var tickFunctions = {};

tickFunctions.noTick = function(){
};

tickFunctions.boxTick = function(){
	if(INPUT.isKeyDown("w")){
		this.body.position.z -= 0.1;
	}
	if(INPUT.isKeyDown("s")){
		this.body.position.z += 0.1;
	}
	if(INPUT.isKeyDown("a")){
		this.body.position.x -= 0.1;
	}
	if(INPUT.isKeyDown("d")){
		this.body.position.x += 0.1;
	}
	
	GAME.camera.position.x = this.body.position.x;
	GAME.camera.position.y = this.body.position.y+2;
	GAME.camera.position.z = this.body.position.z+5;
}