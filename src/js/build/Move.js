/*
* Move class representing a basic move or activated move
*/

function Move(slot, data){

	let self = this;
	let gm = GameMaster.getInstance();
	self.moveId = data.moveId;
	self.unlockLevel = 1;
	self.upgradeLevel = 16;

	if(slot == "basic"){
		self.moveName = msg("basic_attack");
	} else{
		self.moveName = msg(self.moveId);
	}

	switch(slot){
		case "basic":
			self.boostCount = data.boostCount;
		break;

		case "slot1":
		case "slot2":
			self.style = data.style;
			self.category = data.category;
			self.type = data.type;
			self.unlockLevel = data.level;
			self.upgradeLevel = data.upgrade;
			self.cooldown = data.cooldown;
		break;

		case "unite":
			self.category = data.category;
			self.unlockLevel = data.level;
		break;
	}
}

// Hello I am a tiny class
