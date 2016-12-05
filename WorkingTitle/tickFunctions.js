var tickFunctions = {};

/* HELPER FUNCTIONS */
var killObject = function(deadObj){
	if(deadObj.mesh.parent.killable){
		var idx = GAME.entities.indexOf(deadObj);
		if (idx > -1){
			GAME.entities.splice(idx, 1);
		}
		
		console.log("KILLED");
		GAME.world.remove(deadObj.body);
		GAME.scene.remove(deadObj.mesh.parent);
	}
}

var coneHitbox = function(position, direction, angle, range, damage, knockbackAmount){
	var dist;
	var knockback = new CANNON.Vec3();
	var entityDir = new CANNON.Vec3();;
	var betweenAngle;
	direction.normalize();
	direction.scale(knockbackAmount, knockback);
	
	for (var entity in GAME.entities){
		dist = position.distanceTo(GAME.entities[entity].body.position);
		if(dist < range){
			GAME.entities[entity].body.position.vsub(position, entityDir);
			entityDir.normalize();
			betweenAngle = Math.acos(entityDir.dot(direction));
			if(betweenAngle < angle){
				if(GAME.entities[entity].mesh.parent.killable){
					GAME.entities[entity].currentHealth -= damage;
					GAME.entities[entity].body.velocity.vadd(knockback, GAME.entities[entity].body.velocity);
				}
			}
		}
	}
}


/* TICK FUNCTIONS */
tickFunctions.noTick = function(){
};

tickFunctions.enemyTick = function(){
	var ms = 1;
	
	var currLoc = this.body.position;
	if(currLoc.y < -400){
		killObject(this);
	}
	
	var target = GAME.player.body.position.clone();
	
	var yVel = this.body.velocity.y;
	
	target.vsub(currLoc, target);
	target.normalize();
	target.scale(ms, target);
	target.y = yVel;
	
	this.body.velocity = target;
	
	if(this.currentHealth <= 0){
		killObject(this);
	}
};

tickFunctions.boxTick = function(actions){
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
	
	// MOVEMENT
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
		this.mesh.pitchObj.rotation.x = Math.max(Math.min(this.mesh.pitchObj.rotation.x ,Math.PI/2) ,-Math.PI/2);
		this.mesh.yawObj.rotation.y -= INPUT.getMouseXChange()/100;
	}
	
	// ACTIONS
	while(actions.length > 0){
		var action = actions.shift();
		// attack
		if(action.buttons == 1){
			console.log("ATTACK");
			/*
			for (var entity in GAME.entities){
				if(GAME.entities[entity].mesh.parent.killable){
					GAME.entities[entity].currentHealth -= 26;
				}
			}
			*/
			coneHitbox(this.body.position, forwardVec, Math.PI/4, 10, 26, 15);
		}
	}
}