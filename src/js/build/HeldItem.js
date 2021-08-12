/*
* Held Item class representing a specific item held by a Pokemon
*/

function HeldItem(id){

	let self = this;
	let gm = GameMaster.getInstance();
	let data = gm.getHeldItemById(id);

	if(! data)
		return false;

	self.itemId = data.itemId;
	self.itemName = self.itemId;
	self.level = 1; // In the future this will be adjustable
	self.value = 0;
	self.values = data.values;
	self.boosts = [];
	self.stacks = 1; // Number of times the main value is applied
	self.maxStacks = 6;

	for(var i = 0; i < data.boosts.length; i++){
		self.boosts.push({
			stat: data.boosts[i].stat,
			value: 0,
			values: data.boosts[i].values
		});
	}

	// Set the item's level and the values of its effects and boosts
	self.setLevel = function(value){
		let level = parseInt(value);

		if((value < 1)||(value > 30)){
			value = 30;
		}

		self.level = level;

		// Set the correct base effect value
		let valueIndex = Math.floor(self.level / 10);
		self.value = self.values[valueIndex];

		for(var i = 0; i < self.boosts.length; i++){
			self.boosts[i].value = self.boosts[i].values[valueIndex];
		}
	}

	self.setLevel(30);
}
