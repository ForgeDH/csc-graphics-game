var tickFunctions = {};

tickFunctions.noTick = function(){
};

tickFunctions.boxTick = function(){
	console.log(INPUT.state);
	if(INPUT.isKeyDown("w")){
		console.log(this);
		this.body.position.z -= 0.1;
	}
}