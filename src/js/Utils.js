/*
* Common display and math functions used across the site
*/

// Round a float to a certain number of digits

function displayFloat(number, digits){
	if(digits == 0){
		return Math.round(number);
	}

	number = number * (10 * digits);
	number = Math.round(number);
	number /= (10 * digits);

	return number;
}

// Return a message from the message object

function msg(stringId, dynamicStrings){
	dynamicStrings = typeof dynamicStrings !== 'undefined' ? dynamicStrings : [];

	let message = stringId;

	if(messages[stringId]){
		message = messages[stringId];

		// Replace dynamic portions from array of provided strings
		for(var i = 0; i < dynamicStrings.length; i++){
			message = message.replace("%"+(i+1)+"$s", dynamicStrings[i]);
		}
	} else{
		console.error(stringId + " not found");
	}

	return message;
}

// Returns an element containing a selectable Pokemon tile from the provided build or dataset

function createPokemonSquare(poke, context){
	let $pokeEl = $(".pokemon.template").first().clone().removeClass("template");

	$pokeEl.find(".name").html(msg(poke.pokemonId));
	$pokeEl.find(".image-container").attr("role", poke.role);
	$pokeEl.find(".image").css("background-image", "url("+getAsset(poke.pokemonId, "pokemon", "png")+")");
	$pokeEl.attr("pokemon-id", poke.pokemonId);

	// Show X button for favorites and team squares
	if((context == "favorites")||(context == "teams")){
		$pokeEl.find("a.remove").css("display","flex");
	}

	// Show held items for favorites squares
	if(context == "favorites"){
		for(var i = 0; i < poke.heldItems.length; i++){
			let $item = $("<div class=\"item\"></div>");
			$item.css("background-image", "url("+getAsset(poke.heldItems[i].assetId, "helditems", "png")+")");
			$pokeEl.find(".items").append($item);
		}
	}

	return $pokeEl;
}

// Return the URL of a provided Pokemon or item asset

function getAsset(name, dir, ext){
	return host + "img/" + dir + "/" + name + "." + ext + "?v=" + siteVersion;
}
