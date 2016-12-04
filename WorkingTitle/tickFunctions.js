var tickFunctions = {};

tickFunctions.noTick = function(){
};

tickFunctions.enemyTick = function(){
	var ms = 1;
	
	var currLoc = this.body.position;
	var target = GAME.player.body.position;
	
	target.vsub(currLoc, target);
	target.normalize();
	target.scale(ms, target);
	
	this.body.velocity = target;
};

tickFunctions.boxTick = function(){
	// POSITION
	var ms = 0.5;
	var speedCap = 3;
	var upVec = new CANNON.Vec3(0,1,0);
	
	var facingAngle = this.mesh.yawObj.rotation.y;
	var forwardVec = new CANNON.Vec3(-Math.sin(facingAngle), 0, -Math.cos(facingAngle));
	forwardVec.normalize();

	var rightVec = new CANNON.Vec3();
	forwardVec.cross(upVec, rightVec);
	rightVec.normalize();
	
	if(INPUT.isKeyDown("w")){
		this.body.velocity.vadd(forwardVec.scale(ms, forwardVec), this.body.velocity);
	}
	if(INPUT.isKeyDown("s")){
		this.body.velocity.vsub(forwardVec.scale(ms, forwardVec), this.body.velocity);
	}
	if(INPUT.isKeyDown("a")){
		this.body.velocity.vsub(rightVec.scale(ms, rightVec), this.body.velocity);
	}
	if(INPUT.isKeyDown("d")){
		this.body.velocity.vadd(rightVec.scale(ms, rightVec), this.body.velocity);
	}
	
	if(this.body.velocity.norm() > speedCap){
		this.body.velocity.normalize();
		this.body.velocity.scale(speedCap, this.body.velocity);
	}
	
	// ROTATION	
	if(this.mesh.pitchObj !== undefined){
		this.mesh.pitchObj.rotation.x -= INPUT.getMouseYChange()/100;
		this.mesh.yawObj.rotation.y -= INPUT.getMouseXChange()/100;
	}
}