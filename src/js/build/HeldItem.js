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
	self.dex = data.dex; // This number is used in URl strings
	self.stat = data.stat;
	self.type = data.type;
	self.level = 30; // In the future this will be adjustable
	self.levelIndex = 3;
	self.value = 0;
	self.values = data.values;
	self.boosts = [];
	self.stacks = 1; // Number of times the main value is applied
	self.maxStacks = 1;
	self.assetId = self.itemId; // Used for displaying images

	if(data.maxStacks){
		self.maxStacks = data.maxStacks;
	}

	for(var i = 0; i < data.boosts.length; i++){
		self.boosts.push({
			stat: data.boosts[i].stat,
			value: 0,
			values: data.boosts[i].values,
			type: data.boosts[i].type
		});
	}
	// Set the item's level and the values of its effects and boosts
	self.setLevel = function(value){
		let level = parseInt(value);

		if((value < 1)||(value > 30)){
			value = 30;
		}

		self.level = level;
		self.levelIndex = Math.floor(self.level / 10);

		// Set the correct base effect value
		self.value = self.values[self.levelIndex];

		for(var i = 0; i < self.boosts.length; i++){
			self.boosts[i].value = self.boosts[i].values[self.levelIndex];
		}
	}

	// set the number of stacks for this item
	self.setStacks = function(value){
		value = parseInt(value);

		if(value < 0){
			value = 0;
		} else if(value > self.maxStacks){
			value = self.maxStacks;
		}

		self.stacks = value;
	}

	// Insert values into a dynamic string

	self.descriptionHTML = function(build){
		let $content = $("<div></div>");
		let str = msg(self.itemId+"_description");
		let valueStr = '';

		valueStr = valueStr + self.values[self.levelIndex];

		if(self.type == "percent"){
			valueStr += '%';
		}

		// This code displays exact values of percentage point bonuses
		// Will implement fully later because it requires applying the item to a build

		/*switch(self.itemId){
			case "score_shield":
			case "assault_vest":
			case "buddy_barrier":
			case "leftovers":
				let shieldValue = build.stats.hp.value * (self.value / 100);

				valueStr += ' (' + displayFloat(shieldValue, 0) + ')';
			break;

			case "wise_glasses":
				let spAtkBoost = build.stats.spA.parts[0].value * (self.value / 100);

				console.log(self.value);

				valueStr += ' (' + displayFloat(spAtkBoost, 0) + ')';
			break;
		}*/

		valueStr = '<span class="value">'+valueStr + '</span>';

		str = str.replace("%1$d", valueStr);

		$content.append(str);

		// Add secondary bonuses

		let $secondary = $('<div class="boosts"></div>');

		for(var i = 0; i < self.boosts.length; i++){
			let boostStr = self.boosts[i].value;

			if(self.boosts[i].value > 0){
				boostStr = "+" + boostStr;
			}

			if(self.boosts[i].type == "percent"){
				boostStr += '%';
			}


			$secondary.append('<div class="boost corners"><span>'+boostStr + '</span> ' + msg(self.boosts[i].stat) + '</div>');
		}

		$content.append($secondary);


		return $content;
	}

	self.setLevel(30);
}
