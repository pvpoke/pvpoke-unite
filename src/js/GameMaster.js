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
		object.formats = null;

		let chunksToLoad = ["pokemon", "heldItems", "battleItems", "formats"];
		let chunksLoaded = 0;

		for(var i = 0; i < chunksToLoad.length; i++){
			loadGameMasterChunk(chunksToLoad[i]);
		}

		// Load a given segment of the gamemaster JSON and store it in a GameMaster parameter of the same name

		function loadGameMasterChunk(filename){

			$.getJSON( webRoot+"data/gamemaster/"+filename+".json?v="+siteVersion, function( data ){
				object[filename] = data;

				chunksLoaded++;

				if(filename == "heldItems"){
					object.heldItems.sort((a,b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0));
				}

				if(filename == "battleItems"){
					object.battleItems.sort((a,b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0));
				}

				// Initialize interface if all gamemaster chunks are loaded
				if(chunksLoaded >= chunksToLoad.length){
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

		// Return a game mode format by id

		object.getFormatById = function(id){
			let format;

			$.each(object.formats, function(index, it){

				if(it.id == id){
					format = it;
					return;
				}
			});

			return format;
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


		// Calculate leveling ratings for each Pokemon
		object.generateLevelingScores = function(){
			for(var i = 0; i < object.pokemon.length; i++){
				let build = new Build(object.pokemon[i].pokemonId);

				// What levels does this Pokemon unlock its first and second move?
				let slot1Unlock = build.movePool.slot1[1].unlockLevel;
				let slot2Unlock = build.movePool.slot2[1].unlockLevel;
				let firstMoveUnlock = Math.min(slot1Unlock, slot2Unlock);
				let secondMoveUnlock = Math.max(slot1Unlock, slot2Unlock);
				let uniteUnlock = build.moves.unite.unlockLevel;

				// At which level does this Pokemon reach a certain percent of its maximum stats?
				let level15Stats = build.calculateStats(15);
				let level15Total = level15Stats["hp"].value + level15Stats["atk"].value + level15Stats["def"].value + level15Stats["sp_atk"].value + level15Stats["sp_def"].value;
				let minimumStatLevel = 15;

				for(var n = 1; n <= 15; n++){
					let levelStats = build.calculateStats(n);
					let levelTotal = levelStats["hp"].value + levelStats["atk"].value + levelStats["def"].value + levelStats["sp_atk"].value + levelStats["sp_def"].value;

					if(levelTotal / level15Total > .6){
						minimumStatLevel = n;
						break;
					}
				}

				// Do a weighted average of these
				// This value ranges from 6 to 9
				let averageLevel = ( (firstMoveUnlock * 3) + (secondMoveUnlock * 6) + (uniteUnlock * 2) + (minimumStatLevel * 5)) / 16;

				console.log(build.pokemonId + "  " + firstMoveUnlock + " " + secondMoveUnlock + " " + uniteUnlock + " " + minimumStatLevel + " " + averageLevel);

				let stars = 1 - ((averageLevel - 6) / 3);
				stars = Math.round(stars * 10) / 2;

				console.log(build.pokemonId + "  " + stars);

				object.pokemon[i].ratings.leveling = stars;
			}

			console.log(JSON.stringify(object.pokemon));
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

GameMaster.getInstance();
