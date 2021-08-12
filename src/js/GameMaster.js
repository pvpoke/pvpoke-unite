/*
*  The GameMaster loads and controls all game data.
*  It's a singleton object, so only one instance can
*  exist at a time and any reference to it will return
*  the existing instance.
*/


var GameMaster = (function () {
    var instance;

    function createInstance(interface) {
        var object = new Object();

		object.pokemon = null;
		object.battleItems = null;
		object.heldItems = null;

		loadGameMasterChunk("pokemon");
		loadGameMasterChunk("heldItems");
		loadGameMasterChunk("battleItems");

		// Load a given segment of the gamemaster JSON and store it in a GameMaster parameter of the same name

		function loadGameMasterChunk(filename){

			$.getJSON( webRoot+"data/gamemaster/"+filename+".json?v="+siteVersion, function( data ){
				object[filename] = data;

				// Initialize interface if all gamemaster chunks are loaded
				if((object.pokemon !== null) && (object.battleItems !== null) && (object.heldItems !== null)){
					InterfaceMaster.getInstance().init(object);
				}
			});
		}

		// Return Pokemon data given species ID

		object.getPokemonById = function(id){
			let pokemon;

			$.each(object.pokemon, function(index, poke){

				if(poke.pokemonId == id){
					pokemon = poke;
					return;
				}
			});

			return pokemon;
		}

		// Return Held Item data given item ID

		object.getHeldItemById = function(id){
			let item;

			$.each(object.heldItems, function(index, it){

				if(it.itemId == id){
					item = it;
					return;
				}
			});

			return item;
		}

		// Return Held Item data given item ID

		object.getBattleItemById = function(id){
			let item;

			$.each(object.battleItems, function(index, it){

				if(it.itemId == id){
					item = it;
					return;
				}
			});

			return item;
		}

        return object;
    }

    return {
        getInstance: function (interface) {
            if (!instance) {
                instance = createInstance(interface);
            }
            return instance;
        }
    };
})();
