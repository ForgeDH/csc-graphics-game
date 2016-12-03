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
					});
			GAME.scene.add(object);
		});
		
		// load physics
		var boxShape = new CANNON.Box(new CANNON.Vec3(JSONobj.boxSize.x,JSONobj.boxSize.y,JSONobj.boxSize.z));
		this.body = new CANNON.Body({mass: JSONobj.mass, shape: boxShape});
		this.body.position.set(JSONobj.boxPos.x, JSONobj.boxPos.y, JSONobj.boxPos.z);
		this.body.rotation.set(JSONobj.boxRot.x, JSONobj.boxRot.y, JSONobj.boxRot.z);
		GAME.world.add(cube.body);
	}
	
	updateMeshToBody(){
		this.mesh.position.x = this.body.position.x;
		this.mesh.position.y = this.body.position.y;
		this.mesh.position.z = this.body.position.z;
		
		this.mesh.rotation.x = this.body.rotation.x;
		this.mesh.rotation.y = this.body.rotation.y;
		this.mesh.rotation.z = this.body.rotation.z;
	}
}










