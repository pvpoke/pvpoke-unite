/*
* The main Build class used to represent a build and its Pokemon
*/

function Build(id){
	let self = this;
	let gm = GameMaster.getInstance();

	self.heldItems = [];
	self.battleItem = null;
	self.stageId = '';
	self.level = 1;


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

		self.calculateStats();
	}

	// Set the level for this Pokemon

	self.setLevel = function(value){
		value = parseInt(value);

		if((value < 1) || (value > 15)){
			value = 1;
		}

		self.level = value;
		self.calculateStats();
	}

	// Calculate this build's stats after setting Pokemon or level

	self.calculateStats = function(){
		let statSet = self.baseStats[self.level - 1];

		self.stats = {
			overall: 0,
			hp: statSet.hp,
			atk: statSet.atk,
			def: statSet.def,
			spA: statSet.spA,
			spD: statSet.spD,
			speed: statSet.speed
		};

		// Factor in held items here

		// Calculate overall stat
		let statProduct = self.stats.hp * self.stats.atk * self.stats.def * self.stats.spA * self.stats.spD;

		self.stats.overall = Math.round(statProduct / 1000000);

		// Set this Pokemon's evolutionary stage at its current level
		for(var i = 0; i < self.stages.length; i++){
			if(self.level >= self.stages[i].level){
				self.stage = self.stages[i];
			}
		}

		console.log(self.stats);
	}

	self.setPokemon(id); // Initialize with given ID
}
