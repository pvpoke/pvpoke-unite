/*
* Move class representing a basic move or activated move
*/

function Move(slot, data){

	let self = this;
	let gm = GameMaster.getInstance();
	self.moveId = data.moveId;
	self.unlockLevel = 1;
	self.upgradeLevel = 16;
	self.color = "";

	if(data.color){
		self.color = data.color;
	}

	switch(slot){
		case "basic":
			self.moveName = msg("basic_attack");
			self.boostCount = data.boostCount;
			self.style = data.style;
			self.boostStyle = data.boostStyle;
			self.assetId = "basic";
			self.color = "basic";
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
			self.baseCooldown = data.cooldown;
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

	// Adjust this move's cooldown provided a cooldown stat. Cooldown stat is a number between 0 and 100, 100 representing default cooldown.

	self.updateCooldown = function(cooldownStat){
		self.cooldown = self.baseCooldown * (cooldownStat / 100);
	}
}

// Hello I am a tiny class
