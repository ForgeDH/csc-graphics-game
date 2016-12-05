class Entity{
	constructor(name, isPlayer){
		
		var JSONobj = resources[name];
		
		// get miscellaneous
		if(JSONobj.health !== undefined){
			this.health = JSONobj.health;
			this.currentHealth = JSONobj.health;
		}
		
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
	}
}
