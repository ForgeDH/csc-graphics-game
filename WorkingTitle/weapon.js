class Weapon{
	constructor(name){
		
		var JSONobj = resources[name];
		
		// load model
		this.mesh = resources[name+"mesh"].parent.clone(undefined, true).children[0];
		
		// load tick function
		this.tick = hitboxFunctions[JSONobj.hitFunc];
		
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
