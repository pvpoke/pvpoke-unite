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

		// Return Held Item data given item dex number

		object.getHeldItemByDex = function(dex){
			let item;

			$.each(object.heldItems, function(index, it){

				if(it.dex == dex){
					item = it;
					return;
				}
			});

			return item;
		}

		// Return Held Item data given item

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

		// Return Held Item data given item dex number

		object.getBattleItemByDex = function(dex){
			let item;

			$.each(object.battleItems, function(index, it){

				if(it.dex == dex){
					item = it;
					return;
				}
			});

			return item;
		}

		// Generate a full list of string ID's to be localized from the Pokemon data
		object.generatePokemonStringIDs = function(){
			let arr = [];

			for(var i = 0; i < object.pokemon.length; i++){
				let pokemon = object.pokemon[i];

				for(var n = 0; n < pokemon.stages.length; n++){
					arr.push({id: pokemon.stages[n].stageId, str: idToString(pokemon.stages[n].stageId)});
				}

				arr.push({id: pokemon.moves.basic.moveId+"_description", str: ""});

				for(var n = 0; n < pokemon.moves.slot1.length; n++){
					arr.push({id: pokemon.moves.slot1[n].moveId, str: idToString(pokemon.moves.slot1[n].moveId)});
					arr.push({id: pokemon.moves.slot1[n].moveId+"_description", str: ""});

					if(n > 0){
						arr.push({id: pokemon.moves.slot1[n].moveId+"_upgrade", str: ""});
					}
				}

				for(var n = 0; n < pokemon.moves.slot2.length; n++){
					arr.push({id: pokemon.moves.slot2[n].moveId, str: idToString(pokemon.moves.slot2[n].moveId)});
					arr.push({id: pokemon.moves.slot2[n].moveId+"_description", str: ""});

					if(n > 0){
						arr.push({id: pokemon.moves.slot2[n].moveId+"_upgrade", str: ""});
					}
				}

				arr.push({id: pokemon.moves.unite.moveId, str: idToString(pokemon.moves.unite.moveId)});
				arr.push({id: pokemon.moves.unite.moveId+"_description", str: ""});
				arr.push({id: pokemon.moves.passive.moveId, str: idToString(pokemon.moves.passive.moveId)});
				arr.push({id: pokemon.moves.passive.moveId+"_description", str: ""});
			}

			let csv = '';

			for(var i = 0; i < arr.length; i++){
				csv += arr[i].id + ',' + arr[i].str + '\n';
			}

			console.log(csv);
		}

		// Generate a full list of string ID's to be localized from the item data
		object.generateItemStringIDs = function(){
			let arr = [];

			for(var i = 0; i < object.heldItems.length; i++){
				let item = object.heldItems[i];

				arr.push({id: item.itemId, str: idToString(item.itemId)});
				arr.push({id: item.itemId+"_description", str: ""});
			}

			for(var i = 0; i < object.battleItems.length; i++){
				let item = object.battleItems[i];

				arr.push({id: item.itemId, str: idToString(item.itemId)});
				arr.push({id: item.itemId+"_description", str: ""});
			}

			let csv = '';

			for(var i = 0; i < arr.length; i++){
				csv += arr[i].id + ',' + arr[i].str + '\n';
			}

			console.log(csv);
		}

		function idToString(id){
			let str = id.replaceAll("_", " ");
			str = capitalize(str);

			return str;
		}

		function capitalize(words) {
		   var separateWord = words.toLowerCase().split(' ');
		   for (var i = 0; i < separateWord.length; i++) {
		      separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
		      separateWord[i].substring(1);
		   }
		   return separateWord.join(' ');
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
