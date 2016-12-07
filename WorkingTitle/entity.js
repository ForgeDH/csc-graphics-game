class Entity{
	constructor(name, isPlayer){
		
		var JSONobj = resources[name];
		
		// get miscellaneous
		if(JSONobj.health !== undefined){
			this.health = JSONobj.health;
			this.currentHealth = JSONobj.health;
		}
		if(isPlayer){
			this.health = 100;
			this.currentHealth = 100;
		}
		this.name = JSONobj.name;
		// add new enemy to enemies list
		var newName = true;
		if(this.name !== "watson" && this.name !== "arena"){
			for (var x = 0; x < GAME.enemies.length; x++){
				if(GAME.enemies[x].name == name){
					newName = false;
					break;
				}
			}
			if(newName){
				var newEnemy = {};
				newEnemy.name = this.name;
				newEnemy.damage = JSONobj.damage;
			}
		}
		console.log(this.name);
		
		// load model
		this.mesh = resources[name+"mesh"].parent.clone(undefined, true).children[0];
		
		if(this.health !== undefined){
		    console.log(this);
				this.mesh.parent.killable = true;
		}
	
		// make physics
		var boxShape = new CANNON.Box(new CANNON.Vec3(JSONobj.boxSize.x,JSONobj.boxSize.y,JSONobj.boxSize.z));
		this.body = new CANNON.Body({mass: JSONobj.mass, shape: boxShape});
		this.body.position.set(JSONobj.boxPos.x, JSONobj.boxPos.y, JSONobj.boxPos.z);
		this.body.quaternion.setFromEuler(JSONobj.boxRot.x, JSONobj.boxRot.y, JSONobj.boxRot.z, "XYZ");
		this.body.linearDamping = 0.3; //air resistance
		this.body.entity = this;
		
		// load tick function
		this.tick = tickFunctions[JSONobj.tickFunc];
	}
	
	updateMeshToBody(){
		this.mesh.position.x = this.body.position.x;
		this.mesh.position.y = this.body.position.y;
		this.mesh.position.z = this.body.position.z;
		
		//this.body.quaternion.toEuler(this.mesh.rotation, "YZX");
	}
	
	static initPlayer(){
		GAME.camera.position.y = 2;
		GAME.camera.position.z = 5;
		
		var pitchObj = new THREE.Object3D();
		pitchObj.add(GAME.camera);
		
		var yawObj = new THREE.Object3D();
		yawObj.add(pitchObj);
		
		GAME.player.mesh.pitchObj = pitchObj;
		GAME.player.mesh.yawObj = yawObj;
		GAME.player.mesh.add(yawObj);
		
		// add collision detector
		GAME.player.body.addEventListener("collide", function(otherObj){
			console.log(otherObj.body.entity.name);
			for(var enemy in GAME.enemies){
				if(otherObj.body.entity.name == GAME.enemies[enemy].name){
					console.log("Hit by: " + GAME.enemies[enemy].name);
					GAME.player.currentHealth -= GAME.enemies[enemy].damage;
					console.log(player.currentHealth);
				}
			}
		});
	}
}
