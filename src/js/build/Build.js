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
	self.level = 1;
	self.stats = {}; // Object containing the final calculated stats
	self.statParts = {}; // ojbect containing the parts and bonuses making up each stat


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

					for(var n = 0; n < boosts.length; n++){
						if(boosts[n].stat == key){
							parts.push({
								source: item.itemId,
								value: boosts[n].value
							});
						}
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

		if(slot >= self.heldItems.length){
			self.heldItems.push(item);
		} else{
			self.heldItems[slot] = item;
		}
	}

	self.setPokemon(id); // Initialize with given ID
	self.setLevel(level);
}
