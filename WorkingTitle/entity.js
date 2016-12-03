class Entity{
	constructor(JSONurl){
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
		
		// load model
		var JSONobj = getJSONFile(JSONurl);
		var loader = new THREE.OBJLoader();
		var material = new THREE.MeshBasicMaterial({color: 'gray', side: THREE.DoubleSide});
		loader.load(JSONobj.modelURL, function (object) {
			object.traverse(function (child) {
							if (child instanceof THREE.Mesh) {
								child.material = material;
								console.log(this);
								this.mesh = child;
							}
					}.bind(this));
			GAME.scene.add(object);
		}.bind(this));
		
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
			loader.load( JSONobj.textureURL, function ( image ) {
				texture.image = image;
				texture.needsUpdate = true;
			} );
		}
		
		// load physics
		var boxShape = new CANNON.Box(new CANNON.Vec3(JSONobj.boxSize.x,JSONobj.boxSize.y,JSONobj.boxSize.z));
		this.body = new CANNON.Body({mass: JSONobj.mass, shape: boxShape});
		this.body.position.set(JSONobj.boxPos.x, JSONobj.boxPos.y, JSONobj.boxPos.z);
		this.body.quaternion.setFromEuler(JSONobj.boxRot.x, JSONobj.boxRot.y, JSONobj.boxRot.z, "XYZ");
		GAME.world.add(this.body);
	}
	
	updateMeshToBody(){
		this.mesh.position.x = this.body.position.x;
		this.mesh.position.y = this.body.position.y;
		this.mesh.position.z = this.body.position.z;
		
		this.body.quaternion.toEuler(this.mesh.rotation, "YZX");
	}
}










