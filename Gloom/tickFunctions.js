var tickFunctions = {};
var hitboxFunctions = {};
var weaponCDFunctions = {};
var weaponAnimationFunctions = {};

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
		
		var temp = Math.random();
		if(temp > 0.99) {
			console.log("health");
		  addEntity(new HPack(deadObj));
		}
	}
}

var getRandInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


/* HITBOX FUNCTIONS */
hitboxFunctions.coneHitbox = function(attacker){
	var weapon = GAME.player.activeWeapon;	
	if(GAME.weapons[weapon].currCD <= 0){
		GAME.weapons[weapon].animationFrames = GAME.weapons[weapon].cooldown;
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
				entityDir.scale(GAME.weapons[weapon].knockback, knockback);
				if(betweenAngle < GAME.weapons[weapon].angle){
					if(GAME.entities[entity].mesh.parent.killable && GAME.entities[entity] !== GAME.player){
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
		GAME.weapons[weapon].animationFrames = GAME.weapons[weapon].cooldown;
		var raycaster = new THREE.Raycaster();
		
		var knockback = new CANNON.Vec3();
		
		/* OBSOLETED
		var facingAngle = GAME.player.mesh.yawObj.rotation.y;
		var direction = new CANNON.Vec3(-Math.sin(facingAngle), 0, -Math.cos(facingAngle));
		direction.y = GAME.player.mesh.pitchObj.rotation.x;
		direction.normalize();
		direction.scale(GAME.weapons[weapon].knockback, knockback);
		*/
		
		var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3();
    GAME.camera.matrixWorld.decompose( position, quaternion, scale );
    var direction = new THREE.Vector3(0, 0, -1);
    direction = direction.applyQuaternion(quaternion);
    //console.log(direction);
		
		
		var offset = new THREE.Vector3();
		offset.copy(GAME.camera.position);
		
		/* DEBUG
		console.log(direction.x*180/Math.PI);
		console.log(direction.y*180/Math.PI);
		console.log(direction.z*180/Math.PI);
		*/
		
		offset.add(GAME.player.mesh.position);
		raycaster.set(offset, direction);

		var intersect;
		var intersects = [];
		var hitObj;
		var hitDist = Infinity;
		var meshes = [];
		
		
		// check all entities for hit
		for(var entity in GAME.entities){
			intersect = raycaster.intersectObject(GAME.entities[entity].mesh);
			if(intersect.length > 0){


			  //DEBUG: make a sphere at point of intersection
  			//console.log(intersect[0].point);
        var sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.2, 5, 5 ), new THREE.MeshBasicMaterial( {color: 0xffff00} ) );
        GAME.scene.add( sphere );
        setTimeout(function() {GAME.scene.remove(this);}.bind(sphere), 300);
        
        sphere.position.x = intersect[0].point.x;
        sphere.position.y = intersect[0].point.y;
        sphere.position.z = intersect[0].point.z;
  			
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
				hitObj.currentHealth -= GAME.weapons[weapon].damage * 100;
				console.log(hitObj.currentHealth);
				hitObj.body.velocity.vadd(knockback, hitObj.body.velocity);
			}
		}
		GAME.weapons[weapon].currCD = GAME.weapons[weapon].cooldown;
	}
}


/* WEAPON ANIMATION FUNCTIONS */
weaponAnimationFunctions.swingAnimateFunc = function(){
	var currWeapon = GAME.weapons[GAME.player.activeWeapon];
	currWeapon.animationFrames -= 1;
	if(currWeapon.animationFrames > currWeapon.cooldown - 16){
		currWeapon.rotOffset.y += Math.PI/16;
	}
	
	if(currWeapon.animationFrames == 0){
		currWeapon.rotOffset.y = currWeapon.baseRotOffset.y;
	}
}

weaponAnimationFunctions.boopAnimateFunc = function(){
	var currWeapon = GAME.weapons[GAME.player.activeWeapon];
	currWeapon.animationFrames -= 1;
	if(currWeapon.animationFrames > currWeapon.cooldown - 8){
		currWeapon.rotOffset.x -= Math.PI/16;
	}
	
	if(currWeapon.animationFrames == 0){
		currWeapon.rotOffset.x = currWeapon.baseRotOffset.x;
	}
}


/* WEAPON COOLDOWN FUNCTIONS */
weaponCDFunctions.weaponCDTick = function(){
	if(this.currCD > 0){
		this.currCD -= 1;
	}}



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
	
	// kill killable entities
	if(INPUT.isKeyDown("l")){
		var entity = getRandInt(0, GAME.entities.length);
		if(GAME.entities[entity] !== GAME.player){
			killObject(GAME.entities[entity]);
			entity = 0;
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
	
	// update weapon location
	var currWeapon = GAME.weapons[GAME.player.activeWeapon];
	if(currWeapon.animationFrames > 0){
		currWeapon.animate();
	}
	currWeapon.mesh.position.x = GAME.camera.position.x + currWeapon.posOffset.x;
	currWeapon.mesh.position.y = GAME.camera.position.y + currWeapon.posOffset.y;
	currWeapon.mesh.position.z = GAME.camera.position.z + currWeapon.posOffset.z;

	currWeapon.mesh.rotation.x = currWeapon.rotOffset.x;
	currWeapon.mesh.rotation.y = currWeapon.rotOffset.y;
	currWeapon.mesh.rotation.z = currWeapon.rotOffset.z;	
	
	
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
			this.mesh.pitchObj.remove(GAME.weapons[GAME.player.activeWeapon].mesh);
			GAME.player.activeWeapon -= 1;
			if(GAME.player.activeWeapon < 0){
				GAME.player.activeWeapon = GAME.player.numWeapons-1;
			}
			GAME.scene.add(GAME.weapons[GAME.player.activeWeapon].mesh);
			this.mesh.pitchObj.add(GAME.weapons[GAME.player.activeWeapon].mesh);
		}
		if(action.key == "e" && action.eventType == "keydown"){
			GAME.scene.remove(GAME.weapons[GAME.player.activeWeapon].mesh);
			this.mesh.pitchObj.remove(GAME.weapons[GAME.player.activeWeapon].mesh);
			GAME.player.activeWeapon += 1;
			if(GAME.player.activeWeapon >= GAME.player.numWeapons){
				GAME.player.activeWeapon = 0;
			}
			GAME.scene.add(GAME.weapons[GAME.player.activeWeapon].mesh);
			this.mesh.pitchObj.add(GAME.weapons[GAME.player.activeWeapon].mesh);
		}
		
		// quit game
		if(action.key == "p" && action.eventType == "keydown"){
			activeScene = new Scene(gameOverSceneInit, gameOverSceneLoop);
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
	  activeScene = new Scene(gameOverSceneInit, gameOverSceneLoop);
}
