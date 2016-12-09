class HPack{
	constructor(man){

	console.log(resources);
		// load model
    //this.mesh = new THREE.Mesh( new THREE.SphereGeometry( 1.0, 5, 5 ), new THREE.MeshBasicMaterial( {color: 0x00ff00} ) );
		try {
		this.mesh = resources["medPac.jsonmesh"].parent.clone(undefined, true).children[0];
		} catch (e){
		this.mesh = resources["medPac.jsonmesh"].clone(undefined, true);
		}
    var ob = new THREE.Object3D();
    ob.add(this.mesh);
    
			
		// make physics
		var boxShape = new CANNON.Box(new CANNON.Vec3(1.0, 1.0, 1.0))
		this.body = new CANNON.Body({mass: 1, shape: boxShape});
		this.body.position.x = man.mesh.position.x;
		this.body.position.y = man.mesh.position.y;
		this.body.position.z = man.mesh.position.z;
		console.log(this.body.position.x);
		this.body.linearDamping = 0.3; //air resistance

		// load tick function
		this.tick = this.updateMeshToBody();
		
		// get miscellaneous
		/* event code adapted from 
		https://schteppe.github.io/cannon.js/examples/js/PointerLockControls.js
		*/
		this.body.addEventListener("collide",function(otherObj){
			console.log(otherObj);
			var contactNormal = new CANNON.Vec3();
				var contact = otherObj.contact;
				if(contact.bi.id == GAME.player.body.id){
					
    		  GAME.world.remove(this.body);
		      GAME.scene.remove(this.mesh.parent);
		      GAME.scene.remove(this.mesh);
		      
		      //caled twice, so whatever
		      GAME.player.currentHealth++;
		      if(GAME.player.currentHealth > 100) GAME.player.currentHealth = 100;
				}

		}.bind(this));
		
		this.name = "Hpack";
}
	
	updateMeshToBody(){
		this.mesh.position.x = this.body.position.x;
		this.mesh.position.y = this.body.position.y;
		this.mesh.position.z = this.body.position.z;
		
		//this.body.quaternion.toEuler(this.mesh.rotation, "YZX");
	}
}
