/*
* The main Build class used to represent a build and its Pokemon
*/

function Build(id){
	let self = this;
	let gm = GameMaster.getInstance();
	let stats = {
		hp: 0, atk: 0, def: 0, spA: 0, spD: 0, speed: 0
	}
	let baseStats = [];

	self.setPokemon = function(id){
		let data = gm.getPokemonById(id);
		baseStats = data.stats;

		console.log(data);
	}

	self.setPokemon(id); // Initialize with given ID
}
