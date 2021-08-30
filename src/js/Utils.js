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

function msg(stringId){
	if(messages[stringId]){
		return messages[stringId];
	} else{
		console.error(stringId + " not found");
		return stringId;
	}
}


function createPokemonSquare(poke){
	let $pokeEl = $(".pokemon.template").first().clone().removeClass("template");

	$pokeEl.find(".name").html(msg(poke.pokemonId));
	$pokeEl.find(".image-container").attr("role", poke.role);
	$pokeEl.find(".image").css("background-image", "url(../img/pokemon/"+poke.pokemonId+".png)");
	$pokeEl.attr("pokemon-id", poke.pokemonId);

	return $pokeEl;
}
