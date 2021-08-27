/*
* Move class representing a basic move or activated move
*/

function Move(slot, data){

	let self = this;
	let gm = GameMaster.getInstance();
	self.moveId = data.moveId;
	self.unlockLevel = 1;
	self.upgradeLevel = 16;

	switch(slot){
		case "basic":
			self.moveName = msg("basic_attack");
			self.boostCount = data.boostCount;
			self.assetId = "basic";
		break;

		case "slot1":
		case "slot2":
			self.moveName = msg(self.moveId);
			self.style = data.style;
			self.category = data.category;
			self.type = data.type;
			self.unlockLevel = data.level;
			self.upgradeLevel = data.upgrade;
			self.cooldown = data.cooldown;
			self.assetId = data.category;
		break;

		case "unite":
			self.moveName = msg(self.moveId);
			self.category = data.category;
			self.unlockLevel = data.level;
			self.assetId = "unite";
		break;

		case "passive":
			self.moveName = msg(self.moveId);
			self.assetId = "passive";
		break;
	}
}

// Hello I am a tiny class
