// Functionality for lane object

function Lane(id, n){
	let self = this;
	let gm = GameMaster.getInstance();
	self.laneId = id;
	self.cap = n;
}
