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

	// Remove a Pokemon from a specific lane given the Pokemon's index in that lane
	self.removePokemon = function(laneId, index){
		let counter = 0;

		for(var i = 0; i < self.pokemon.length; i++){
			if(self.pokemon[i].lane == laneId){
				if(counter == index){
					self.pokemon[i].splice(i, 1);
				} else{
					counter++;
				}
			}
		}
	}

	// Return an array of Pokemon from specified lane Id's
	self.getPokemon = function(laneId){
		laneId = typeof laneId !== 'undefined' ? laneId : 'all';

		let pokes = [];

		for(var i = 0; i < self.pokemon.length; i++){
			if((self.pokemon[i].lane == laneId)||(laneId == "all")){
				pokes.push(self.pokemon[i]);
			}
		}

		return pokes;
	}

	// Returns true if the specified lane is at capacity
	self.isLaneFull = function(laneId){
		if(self.getPokemon(laneId).length < self.lanes[laneId].cap){
			return false;
		} else{
			return true;
		}
	}
}
