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
		self.lanes[format.lanes[i].id] = new Lane(format.lanes[i].id, format.lanes[i].str, format.lanes[i].cap);
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

	// Returns whether this team has a specific Pokemon
	self.hasPokemon = function(pokemonId){
		for(var i = 0; i < self.pokemon.length; i++){
			if(self.pokemon[i].pokemonId == pokemonId){
				return true;
			}
		}

		return false;
	}

	// Return a lane ID of a lane based on its index in the lane array
	self.getLaneByIndex = function(i){
		let index = 0;

		for(var key in self.lanes){
			if(self.lanes.hasOwnProperty(key)){

				if(index == i){
					return key;
				}

				index++;
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

	// Return the current format
	self.getFormat = function(){
		return format;
	}

	// Returns true if the specified lane is at capacity
	self.isLaneFull = function(laneId){
		if(self.getPokemonList(laneId).length < self.lanes[laneId].cap){
			return false;
		} else{
			return true;
		}
	}

	// Generate a string to be parsed for URLs
	// Format: formatId - lane index - comma seperated Pokemon strings
	// venusaur-15-01-5-6-3-9

	self.generateURLString = function(){

		let str = format.id;

		// For each lane, add Pokemon in the lane
		let index = 0;

		for(var key in self.lanes){
			if(self.lanes.hasOwnProperty(key)){
				let pokemon = self.getPokemonList(key);

				if(pokemon.length > 0){
					str += '/' + index + '/';

					for(var i = 0; i < pokemon.length; i++){
						str += pokemon[i].generateURLString(false);

						if(i < pokemon.length - 1){
							str += ',';
						}
					}
				}


				index++;
			}
		}

		return str;
	}
}

// Generate a new Team from a URL string
// 0 - format, 1 - lane index 1, 2 - Pokemon in lane 1, etc.

function generateTeamFromString(str){
	let arr = str.split("/");
	let gm = GameMaster.getInstance();

	let team = new Team(arr[0]);

	// For each pair of lane and Pokemon, add Pokemon to that lane
	for(var i = 1; i < arr.length; i+=2){
		if(i + 1 > arr.length -1){
			continue;
		}

		let laneId = team.getLaneByIndex(arr[i]);
		let buildArr = arr[i+1].split(",");

		for(var n = 0; n < buildArr.length; n++){
			let build = generateBuildFromString(buildArr[n]);
			team.addPokemon(build, laneId);
		}
	}

	return team;
}
