var tickFunctions = {};
var hitboxFunctions = {};
var weaponCDFunctions = {};

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


/* HITBOX FUNCTIONS */
hitboxFunctions.coneHitbox = function(attacker){
	var weapon = GAME.player.activeWeapon;	
	if(GAME.weapons[weapon].currCD <= 0){
		var dist;
		var knockback = new CANNON.Vec3();
		var entityDir = new CANNON.Vec3();
		var betweenAngle;

		var position = new CANNON.Vec3(attacker.body.position.x, attacker.body.position.y, attacker.body.position.z);
		
		var facingAngle = GAME.player.mesh.yawObj.rotation.y;
		var direction = new CANNON.Vec3(-Math.sin(facingAngle), 0, -Math.cos(facingAngle));
		direction.normalize();
		direction.scale(GAME.weapons[weapon].knockback, knockback);

		GAME.weapons[weapon].currCD = GAME.weapons[weapon].cooldown;
		for (var entity in GAME.entities){
			dist = position.distanceTo(GAME.entities[entity].body.position);
			if(dist < GAME.weapons[weapon].range){
				GAME.entities[entity].body.position.vsub(position, entityDir);
				entityDir.normalize();
				betweenAngle = Math.acos(entityDir.dot(direction));
				if(betweenAngle < GAME.weapons[weapon].angle){
					if(GAME.entities[entity].mesh.parent.killable){
						GAME.entities[entity].currentHealth -= GAME.weapons[weapon].damage;
						GAME.entities[entity].body.velocity.vadd(knockback, GAME.entities[entity].body.velocity);
					}
				}
			}
		}
	}
}

hitboxFunctions.hitscanHitbox = function(attacker){
	var weapon = GAME.player.activeWeapon;
	if(GAME.weapons[weapon].currCD <= 0){
		var raycaster = new THREE.Raycaster();
		
		var knockback = new CANNON.Vec3();
		
		var facingAngle = GAME.player.mesh.yawObj.rotation.y;
		var direction = new CANNON.Vec3(-Math.sin(facingAngle), 0, -Math.cos(facingAngle));
		direction.y = GAME.player.mesh.pitchObj.rotation.x;
		direction.normalize();
		direction.scale(GAME.weapons[weapon].knockback, knockback);
		
		var offset = new THREE.Vector3();
		offset.copy(GAME.camera.position);
		
		/*
		console.log(direction.x*180/Math.PI);
		console.log(direction.y*180/Math.PI);
		console.log(direction.z*180/Math.PI);
		*/
		
		//raycaster.set(GAME.player.body.position, direction);
		raycaster.set(offset.add(GAME.player.mesh.position), direction);
		var intersect;
		var intersects = [];
		var hitObj;
		var hitDist = Infinity;
		var meshes = [];
		
		
		// check all entities for hit
		for(var entity in GAME.entities){
			intersect = raycaster.intersectObject(GAME.entities[entity].mesh);
			if(intersect.length > 0){
				intersects.push(intersect[0]);
			}
		}
		for (var obj = 0; obj < intersects.length; obj++){
			if(intersects[obj].distance < hitDist){
				hitObj = intersects[obj].object.entity;
				hitDist = intersects[obj].distance;
			}
		}
		
		// HIT
		if(hitDist < Infinity){
			var isEnemy = false;
			for(var idx = 0; idx < GAME.enemies.length; idx++){
				if(GAME.enemies[idx].name == hitObj.name){
					isEnemy = true;
					break;
				}
			}
			if(isEnemy){
				console.log("MASSIVE DAMAGE");
				console.log(hitObj);
				console.log(hitObj.currentHealth);
				hitObj.currentHealth -= GAME.weapons[weapon].damage*100;
				console.log(hitObj.currentHealth);
				hitObj.body.velocity.vadd(knockback, hitObj.body.velocity);
			}
		}
		GAME.weapons[weapon].currCD = GAME.weapons[weapon].cooldown;
	}
}


/* WEAPON COOLDOWN FUNCTIONS */
weaponCDFunctions.weaponCDTick = function(){
	if(this.currCD > 0){
		this.currCD -= 1;
	}
}



/* TICK FUNCTIONS */
tickFunctions.noTick = function(){
};


tickFunctions.enemyTick = function(){

	var ms = 0.1;
	
	var currLoc = this.body.position;
	if(currLoc.y < -50){
		killObject(this);
	}
	
	var target = GAME.player.body.position.clone();
	
	target.vsub(currLoc, target);
	target.normalize();
	target.scale(ms, target);
	target.y = 0;
	
	// get rotation angle
	var angle = Math.atan2(target.z, target.x)*-1;
	this.body.quaternion.setFromEuler(0, angle, 0, "XYZ");
	this.mesh.rotation.y = angle;
	
	this.body.velocity.vadd(target, this.body.velocity);
	
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
	if(INPUT.isKeyDown(" ")){
		if(this.canJump || this.jumpFrames > 0){
			this.body.velocity.vadd(new CANNON.Vec3(0,2,0), this.body.velocity);
			if(this.canJump){
				this.jumpFrames = 5;
			}
			this.canJump = false;
		}
	}
	
	if(this.body.velocity.norm() > speedCap){
		this.body.velocity.scale(0.9, this.body.velocity);
	}
	
	// ROTATION	
	if(this.mesh.pitchObj !== undefined){
		this.mesh.pitchObj.rotation.x -= INPUT.getMouseYChange()/100;
		this.mesh.pitchObj.rotation.x = Math.max(Math.min(this.mesh.pitchObj.rotation.x ,Math.PI/2) ,-Math.PI/2);
		this.mesh.yawObj.rotation.y -= INPUT.getMouseXChange()/100;
	}
	
	// update weapon location and rotation
	weaponMesh = GAME.weapons[GAME.player.activeWeapon].mesh;
	weaponMesh.position.x = this.body.position.x;
	weaponMesh.position.y = this.body.position.y+2;
	weaponMesh.position.z = this.body.position.z;
	forwardVec = new CANNON.Vec3(-Math.sin(facingAngle), 0, -Math.cos(facingAngle));
	forwardVec.y = GAME.player.mesh.pitchObj.rotation.x;
	forwardVec.normalize();
	weaponMesh.rotation.x = forwardVec.x;
	weaponMesh.rotation.y = forwardVec.y;
	weaponMesh.rotation.z = forwardVec.z;
	
	// ACTIONS
	while(actions.length > 0){
		var action = actions.shift();
		// attack
		if(action.buttons == 1){
			GAME.weapons[this.activeWeapon].hit(this);
		}
		
		// change weapons
		if(action.key == "q" && action.eventType == "keydown"){
			GAME.scene.remove(GAME.weapons[GAME.player.activeWeapon].mesh);
			GAME.player.activeWeapon -= 1;
			if(GAME.player.activeWeapon < 0){
				GAME.player.activeWeapon = GAME.player.numWeapons-1;
			}
			GAME.scene.add(GAME.weapons[GAME.player.activeWeapon].mesh);
		}
		if(action.key == "e" && action.eventType == "keydown"){
			GAME.scene.remove(GAME.weapons[GAME.player.activeWeapon].mesh);
			GAME.player.activeWeapon += 1;
			if(GAME.player.activeWeapon >= GAME.player.numWeapons){
				GAME.player.activeWeapon = 0;
			}
			GAME.scene.add(GAME.weapons[GAME.player.activeWeapon].mesh);
		}
	}
	
	// I-frames and J-frames	
	if(this.invincible > 0){
		this.invincible -= 1;
	}
	if(this.jumpFrames > 0){
		this.jumpFrames -= 1;
	}
	
	//FALLING INTO THE VOID
	if(this.mesh.position.y < -50 || this.currentHealth <= 0)
	  activeScene = new Scene(menuSceneInit, menuSceneLoop);
}
