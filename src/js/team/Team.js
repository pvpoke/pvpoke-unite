// Functionality for team object

function Team(formatId){
	let self = this;
	let gm = GameMaster.getInstance();
	let format = gm.getFormatById(formatId);
	self.cap = format.teamCap;

	// Initialize lanes
	self.lanes = {};
	self.pokemon = [];

	for(var i = 0; i < format.lanes.length; i++){
		self.lanes[format.lanes[i].id] = new Lane(format.lanes[i].id, format.lanes[i].cap);
	}

	// Add a build with a specified lane ID
	self.addPokemon = function(build, laneId){
		if((self.pokemon.length < self.cap)&&(! self.isLaneFull(laneId))){
			build.lane = laneId;
			self.pokemon.push(build);
		}
	}

	// Replace a specified Pokemon from a specified lane with a new build
	self.replacePokemon = function(build, laneId, newBuild){

		for(var i = 0; i < self.pokemon.length; i++){
			if(self.pokemon[i] == build){
				self.pokemon[i] = newBuild;
				newBuild.lane = laneId;
			}
		}
	}

	// Remove a Pokemon from a specific lane given the Pokemon's index in that lane
	self.removePokemon = function(laneId, index){
		let counter = 0;
		
		for(var i = 0; i < self.pokemon.length; i++){
			if(self.pokemon[i].lane == laneId){
				if(counter == index){
					self.pokemon.splice(i, 1);
					return;
				} else{
					counter++;
				}
			}
		}
	}

	// Return an array of Pokemon from specified lane Id's
	self.getPokemonList = function(laneId){
		laneId = typeof laneId !== 'undefined' ? laneId : 'all';

		let pokes = [];

		for(var i = 0; i < self.pokemon.length; i++){
			if((self.pokemon[i].lane == laneId)||(laneId == "all")){
				pokes.push(self.pokemon[i]);
			}
		}

		return pokes;
	}

	// Return a specific build given its ID and lane
	self.getBuild = function(pokemonId, laneId){

		let build;

		for(var i = 0; i < self.pokemon.length; i++){
			if((self.pokemon[i].lane == laneId)&&(self.pokemon[i].pokemonId == pokemonId)){
				build = self.pokemon[i];
			}
		}

		return build;
	}

	// Returns true if the specified lane is at capacity
	self.isLaneFull = function(laneId){
		if(self.getPokemonList(laneId).length < self.lanes[laneId].cap){
			return false;
		} else{
			return true;
		}
	}
}
