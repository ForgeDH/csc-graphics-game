var tickFunctions = {};

tickFunctions.noTick = function(){
};

tickFunctions.boxTick = function(){
	if(INPUT.isKeyDown("w")){
		this.body.position.z -= 0.1;
	}
}