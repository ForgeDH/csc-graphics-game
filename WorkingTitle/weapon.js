class Weapon{
	constructor(name){
		
		var JSONobj = resources[name];
		this.name = JSONobj.name;
		
		// load model
		this.mesh = resources[name+"mesh"].parent.clone(undefined, true).children[0];
		this.mesh.position.y = 5;
		
		this.posOffset = {};
		this.posOffset.x = JSONobj.posOffset.x;
		this.posOffset.y = JSONobj.posOffset.y;
		this.posOffset.z = JSONobj.posOffset.z;
		this.rotOffset = {};
		this.rotOffset.x = JSONobj.rotOffset.x;
		this.rotOffset.y = JSONobj.rotOffset.y;
		this.rotOffset.z = JSONobj.rotOffset.z;
		
		// load tick function
		this.hit = hitboxFunctions[JSONobj.hitFunc];
		this.tick = weaponCDFunctions[JSONobj.tickFunc]
		
		this.damage = JSONobj.damage;
		this.knockback = JSONobj.knockback;
		this.cooldown = JSONobj.cooldown;
		this.currCD = 0;
		
		if(JSONobj.range !== undefined)
			this.range = JSONobj.range;
		if(JSONobj.angle !== undefined)
			this.angle = JSONobj.angle;
		
		console.log(this.name);
	}
}
