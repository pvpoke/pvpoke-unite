/*
 * Funtionality for the Build selector interface
 */

function BuildSelect(element, ctx){
	let self = this;
	let $el = element;
	let $pokeSearch = $el.find("input.poke-search");
	let gm = GameMaster.getInstance();
	let build;
	let interface = InterfaceMaster.getInstance();
	let context = ctx;

	this.init = function(){

		$.each(gm.pokemon, function(n, poke){
			let $pokeEl = $el.find(".pokemon-list .pokemon.template").clone().removeClass("template");

			$pokeEl.find(".name").html(poke.pokemonId);
			$pokeEl.attr("pokemon-id", poke.pokemonId);
			$el.find(".pokemon-list").append($pokeEl);
		});

		$pokeSearch.val("");
	}


	// Search select Pokemon

	$el.find(".poke-search").on("keyup", function(e){

		let searchStr = $el.find(".poke-search").val().toLowerCase();

		if(searchStr == ''){
			$el.find(".pokemon").show();
			return;
		}

		$el.find(".pokemon").each(function(index, value){
			if($(this).attr("pokemon-id").startsWith(searchStr)){
				$(this).show();
			} else{
				$(this).hide();
			}
		});
	});

	// Select a Pokemon

	$el.on("click", ".pokemon-list .pokemon", function(e){

		let pokemonId = $(e.target).closest(".pokemon").attr("pokemon-id");

		let build = new Build(pokemonId);
	});

}
