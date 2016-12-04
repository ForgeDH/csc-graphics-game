class Entity{
	constructor(JSONurl, isPlayer){
		function getJSONFile(url) {
			try {
					if (typeof(url) !== "string")
							throw "getJSONFile: parameter not a string";
					else {
							var httpReq = new XMLHttpRequest(); // a new http request
							httpReq.open("GET",url,false); // init the request
							httpReq.send(null); // send the request
							var startTime = Date.now();
							while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
									if ((Date.now()-startTime) > 3000)
											break;
							} // until its loaded or we time out after three seconds
							return JSON.parse(httpReq.response); 
					} // end if good params
			} // end try    
			
			catch(e) {
					console.log(e);
					return(String.null);
			}
		} 
		
		// load JSON
		var JSONobj = getJSONFile(JSONurl);
		
		// load texture
		if(JSONobj.textureURL != ""){
			var manager = new THREE.LoadingManager();
			manager.onProgress = function ( item, loaded, total ) {
				console.log( item, loaded, total );
			};
			
			var texture = new THREE.Texture();
			var onProgress = function ( xhr ) {
				if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					console.log( Math.round(percentComplete, 2) + '% downloaded' );
				}
			};
			var onError = function ( xhr ) {
			};

			var loader = new THREE.ImageLoader( manager );
			loader.setCrossOrigin("anonymous");
			loader.load( JSONobj.textureURL, function ( image ) {
				texture.image = image;
				texture.needsUpdate = true;
			} );
		}
		
		// load miscellaneous
		if(JSONobj.health !== undefined){
			this.health = JSONobj.health;
			console.log(this.health);
		}
		
		// load model
		var loader = new THREE.OBJLoader();
		var material = new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0xdddddd, shininess: 30, shading: THREE.FlatShading});
		loader.load(JSONobj.modelURL, function (object) {
			object.traverse(function (child) {
							if (child instanceof THREE.Mesh) {
								if(texture){
									child.material.map = texture;
								} else {
									child.material = material;
								}
								this.mesh = child;
							}
					}.bind(this));
			//if(this.health !== undefined){
			//	this.killable = true;
			//}
			if(this.health !== undefined){
				object.killable = true;
			}
			GAME.scene.add(object);
			if(isPlayer !== undefined){
				setTimeout(Entity.initPlayer, 100);
			}
		}.bind(this));
		
		// load physics
		var boxShape = new CANNON.Box(new CANNON.Vec3(JSONobj.boxSize.x,JSONobj.boxSize.y,JSONobj.boxSize.z));
		this.body = new CANNON.Body({mass: JSONobj.mass, shape: boxShape});
		this.body.position.set(JSONobj.boxPos.x, JSONobj.boxPos.y, JSONobj.boxPos.z);
		this.body.quaternion.setFromEuler(JSONobj.boxRot.x, JSONobj.boxRot.y, JSONobj.boxRot.z, "XYZ");
		GAME.world.add(this.body);
		
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










