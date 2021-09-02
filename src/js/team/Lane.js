// Functionality for lane object

function Lane(id, str, n){
	let self = this;
	let gm = GameMaster.getInstance();
	self.laneId = id;
	self.stringId = str;
	self.cap = n;
}
