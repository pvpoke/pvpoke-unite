/*
* The main Build class used to represent a build and its Pokemon
*/

function Build(id, level){
	level = typeof level !== 'undefined' ? level : true;

	let self = this;
	let gm = GameMaster.getInstance();

	self.heldItems = [];
	self.battleItem = null;
	self.stageId = '';
	self.level = 10;
	self.stats = {}; // Object containing the final calculated stats
	self.statParts = {}; // ojbect containing the parts and bonuses making up each stat
	self.moves = {
		basic: {},
		slot1: {},
		slot2: {},
		unite: {},
		passive: {}
	};

	// Apply a new Pokemon to this build

	self.setPokemon = function(id){
		let data = gm.getPokemonById(id);

		// Map JSON data to Pokemon attributes
		self.pokemonId = data.pokemonId;
		self.baseStats = data.stats;
		self.stages = data.stages;
		self.role = data.role;
		self.type = data.type;
		self.style = data.style;
		self.difficulty = data.difficulty;
		self.stages = data.stages;
		self.movePool = data.moves;
		self.ratings = data.ratings;
		self.stageId = self.stages[0].stageId;

		// Set initial moves
		self.moves.basic = new Move("basic", self.movePool.basic);
		self.moves.unite = new Move("unite", self.movePool.unite);
		self.moves.passive = new Move("passive", self.movePool.passive);
		self.moves.slot1 = new Move("slot1", self.movePool.slot1[0]);
		self.moves.slot2 = new Move("slot2", self.movePool.slot2[0]);

		self.setStats();
	}

	// Set the level for this Pokemon

	self.setLevel = function(value){
		value = parseInt(value);

		if((value < 1) || (value > 15)){
			value = 1;
		}

		self.level = value;

		// Set this Pokemon's evolutionary stage at its current level
		for(var i = 0; i < self.stages.length; i++){
			if(self.level >= self.stages[i].level){
				self.stageId = self.stages[i].stageId;
			}
		}

		self.setStats();
	}

	// Set the Pokemon's stats at its current level

	self.setStats = function(){
		self.stats = self.calculateStats(self.level);
	}

	// Return this build's stats at a given level

	self.calculateStats = function(level){

		// Organize each stat into its parts and bonuses

		let stats = {
			hp: { value: 0, parts: []},
			atk: { value: 0, parts: []},
			def: { value: 0, parts: []},
			spA: { value: 0, parts: []},
			spD: { value: 0, parts: []},
			speed: { value: 0, parts: []}
		};

		// Determine base stats
		let statSet = self.baseStats[level - 1];

		// Cycle through each stat and discover base stats and bonuses

		for(var key in stats){
			if(stats.hasOwnProperty(key)){
				let parts = stats[key].parts;
				let baseStat = statSet[key];

				// Add base stat
				parts.push({
					source: "base_stat",
					value: baseStat
				});

				// Add bonuses from held items

				for(var i = 0; i < self.heldItems.length; i++){
					let item = self.heldItems[i];
					let boosts = item.boosts;

					let part = {
						source: item.itemId,
						value: 0
					}

					// Check primary effect
					if(item.stat == key){
						if(item.type == "number"){
							part.value += item.value;
						} else if(item.type == "percent"){
							part.value += item.value * (parts[0].value / 100);
						}
					}

					// Check secondary boosts

					for(var n = 0; n < boosts.length; n++){
						if(boosts[n].stat == key){
							part.value += boosts[n].value;
						}
					}

					if(part.value != 0){
						parts.push(part);
					}
				}

				// Add up all parts
				for(var i = 0; i < parts.length; i++){
					stats[key].value += parts[i].value;
				}
			}
		}

		return stats;
	}

	// Shorthand for accessing stat values
	self.stat = function(key, round){
		let stat = self.stats[key].value;
		if(round){
			stat = displayFloat(stat, 1);
		}

		return stat;
	}

	// Check to see if this Pokemon is holding a specific item

	self.hasHeldItem = function(itemId){
		for(var i = 0; i < self.heldItems.length; i++){
			if(self.heldItems[i].itemId == itemId){
				return true;
			}
		}

		return false;
	}

	// Give this Pokemon a specific held item

	self.giveHeldItem = function(item, slot){
		slot = typeof slot !== 'undefined' ? slot : self.heldItems.length;

		// When given a "none" item, remove the current item or do nothing
		if(item.itemId == "none"){
			if(slot < self.heldItems.length){
				self.heldItems.splice(slot, 1);
			}
			return;
		}

		if(slot >= self.heldItems.length){
			self.heldItems.push(item);
		} else{
			self.heldItems[slot] = item;
		}
	}

	// Give this Pokemon a specific battle item

	self.giveBattleItem = function(item){
		if(item.itemId != "none"){
			self.battleItem = item;
		} else{
			self.battleItem = null;
		}
	}

	// Select a move of a given ID for a given slot

	self.selectMove = function(moveId, slot){
		let moveArr = self.movePool[slot];

		for(var i = 0; i < moveArr.length; i++){
			if(moveArr[i].moveId == moveId){
				self.moves[slot] = new Move(slot, moveArr[i]);
				break;
			}
		}
	}

	// Generate a string to be parsed for URLs
	// Format: speciesId - level - move1index move2index - heldItem1 - heldItem2 - heldItem3 - battleItem
	// venusaur-15-01-5-6-3-9

	self.generateURLString = function(){
		let str = self.pokemonId;

		str += '-' + self.level;

		// Add 1st move selection
		for(var i = 0; i < self.movePool.slot1.length; i++){
			if(self.movePool.slot1[i].moveId == self.moves.slot1.moveId){
				str += "-" + i;
			}
		}

		// Add 2nd move selection
		for(var i = 0; i < self.movePool.slot2.length; i++){
			if(self.movePool.slot2[i].moveId == self.moves.slot2.moveId){
				str += "-" + i;
			}
		}

		// Add held items
		for(var i = 0; i < 3; i ++){
			if(self.heldItems.length > i){
				str += "-" + self.heldItems[i].dex;
			} else{
				str += "-0";
			}
		}

		// Add battle item
		if(self.battleItem){
			str += "-" + self.battleItem.dex;
		} else{
			str += "-0";
		}

		return str;
	}

	self.setPokemon(id); // Initialize with given ID
	self.setLevel(level);
}

// Generate a new Build from a URL string
// Format: speciesId - level - move1index move2index - heldItem1 - heldItem2 - heldItem3 - battleItem
// venusaur-15-0-1-5-6-3-9
// 0 - pokemonId, 1 - level, 2 - slot 1 move index, 3 - slot 2 move index
// 4 - held item 1, 5 - held item 2, 6 - held item 3, 7 - battle item

function generateBuildFromString(str){
	let arr = str.split("-");
	let gm = GameMaster.getInstance();

	if(arr.length < 7)
		return false;

	let build = new Build(arr[0], parseInt(arr[1]));
	let heldItems = [arr[4], arr[5], arr[6]];

	build.selectMove(build.movePool.slot1[arr[2]].moveId, "slot1"); // Human readable code doesn't matter if you commit to never reading your code
	build.selectMove(build.movePool.slot2[arr[3]].moveId, "slot2");

	for(var i = 0; i < heldItems.length; i++){
		if(heldItems[i] > 0){
			let heldItem = gm.getHeldItemByDex(heldItems[i]);
			build.giveHeldItem(new HeldItem(heldItem.itemId), build.heldItems.length);
		}
	}

	if(arr[7] > 0){
		let battleItem = gm.getBattleItemByDex(arr[7]);
		build.giveBattleItem(new BattleItem(battleItem.itemId));
	}

	return build;
}
