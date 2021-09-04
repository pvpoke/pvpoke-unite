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


function createPokemonSquare(poke, context){
	let $pokeEl = $(".pokemon.template").first().clone().removeClass("template");

	$pokeEl.find(".name").html(msg(poke.pokemonId));
	$pokeEl.find(".image-container").attr("role", poke.role);
	$pokeEl.find(".image").css("background-image", "url("+host+"/img/pokemon/"+poke.pokemonId+".png)");
	$pokeEl.attr("pokemon-id", poke.pokemonId);

	if((context == "favorites")||(context == "teams")){
		$pokeEl.find("a.remove").css("display","flex");
	}

	return $pokeEl;
}
