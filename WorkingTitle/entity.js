class Entity{
	constructor(name, isPlayer){
		
		var JSONobj = resources[name];
		
		// load model
		console.log(name+"mesh");
		try {
		this.mesh = resources[name+"mesh"].parent.clone(undefined, true).children[0];
		} catch (e){
		this.mesh = resources[name+"mesh"].clone(undefined, true);
		}
    if(this.mesh.geometry.animations) {
		  mixer = new THREE.AnimationMixer(this.mesh);
		  this.mixer = mixer;
		  var tmixer = mixer.clipAction( this.mesh.geometry.animations[ 0 ] );
		  tmixer.play();
		  mixer.update(Math.random()*4);
		}
		this.mesh.entity = this;
			
		// make physics
		var boxShape = new CANNON.Box(new CANNON.Vec3(JSONobj.boxSize.x,JSONobj.boxSize.y,JSONobj.boxSize.z));
		this.body = new CANNON.Body({mass: JSONobj.mass, shape: boxShape});
		this.body.position.set(JSONobj.boxPos.x, JSONobj.boxPos.y, JSONobj.boxPos.z);
		this.body.quaternion.setFromEuler(JSONobj.boxRot.x, JSONobj.boxRot.y, JSONobj.boxRot.z, "XYZ");
		this.body.linearDamping = 0.3; //air resistance
		this.body.entity = this;
		
		// load tick function
		this.tick = tickFunctions[JSONobj.tickFunc];
		
		// get miscellaneous
		if(JSONobj.health !== undefined){
			this.health = JSONobj.health;
			this.currentHealth = JSONobj.health;
			this.damage = JSONobj.damage;
			// add collision detector
			this.body.addEventListener("collide", function(otherObj){
				if(otherObj.body.entity.name == "watson"){
					if(GAME.player.invincible == 0){
						GAME.player.currentHealth -= this.entity.damage;
						console.log(GAME.player.currentHealth);
						GAME.player.invincible = 5;
					}
					var facingAngle = this.entity.mesh.rotation.y - Math.PI/2;
					var knockbackVec = new CANNON.Vec3(-Math.sin(facingAngle), Math.PI/4, -Math.cos(facingAngle));
					knockbackVec.normalize();
					GAME.player.body.velocity.vadd(knockbackVec.scale(20, knockbackVec), GAME.player.body.velocity);
					GAME.player.canJump = false;
				}
			});
		}
		if(isPlayer){
			this.health = 100;
			this.currentHealth = 100;
			this.jumpFrames = 0;
			this.activeWeapon = 0;
			this.numWeapons = 2;
			
			/* event code adapted from 
			https://schteppe.github.io/cannon.js/examples/js/PointerLockControls.js
			*/
			this.body.addEventListener("collide",function(otherObj){
				var contactNormal = new CANNON.Vec3();
				var contact = otherObj.contact;
				if(contact.bi.id == GAME.player.body.id){
					contact.ni.negate(contactNormal);
				} else {
					contactNormal.copy(contact.ni);
				}
				
				if(contactNormal.dot(new CANNON.Vec3(0,1,0)) > 0.5){
					GAME.player.canJump = true;
				}
			});
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
				GAME.enemies.push(newEnemy);
			}
		}
		
		if(this.health !== undefined){
				// for some reason I needed a boolean here for it to despawn
				if(!this.mesh.parent)
				  this.mesh.parent = new THREE.Object3D();
				this.mesh.parent.killable = true;
		}
		
		console.log(this.name);
	}
	
	updateMeshToBody(){
		this.mesh.position.x = this.body.position.x;
		this.mesh.position.y = this.body.position.y;
		this.mesh.position.z = this.body.position.z;
		
		//this.body.quaternion.toEuler(this.mesh.rotation, "YZX");
	}
	
	static initPlayer(){
		GAME.camera.position.y = 2;
		//GAME.camera.position.z = 5;
		
		var pitchObj = new THREE.Object3D();
		pitchObj.add(GAME.camera);
		
		var yawObj = new THREE.Object3D();
		yawObj.add(pitchObj);
		
		GAME.player.mesh.pitchObj = pitchObj;
		GAME.player.mesh.yawObj = yawObj;
		GAME.player.mesh.add(yawObj);
		GAME.player.invincible = 5;
		GAME.player.canJump = false;
		
		// add weapon to world
		GAME.scene.add(GAME.weapons[GAME.player.activeWeapon].mesh);
		pitchObj.add(GAME.weapons[GAME.player.activeWeapon].mesh);
	}
}
