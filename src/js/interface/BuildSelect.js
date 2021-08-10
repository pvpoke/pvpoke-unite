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

	// Clear the currently selected build and open Pokemon select

	self.clear = function(){
		$el.find(".details").hide();
		$el.find(".poke-select").show();
		$el.find(".poke-select input").val('');
		$el.find(".poke-select .pokemon").show();
	}

	// Update displayed stats, moves, and items from the selected build

	self.update = function(){
		// Display Pokemon's name and image
		$el.find(".selected-pokemon .name").html(build.pokemonId);

		// Display Pokemon's role and type
		$el.find(".attributes").html("");
		$el.find(".attributes").append("<div>"+build.role+"</div>");
		$el.find(".attributes").append("<div>"+build.type+"</div>");
		$el.find(".attributes").append("<div>"+build.style+"</div>");

		// Display Pokemon's stats

		$el.find(".stat.overall .stat-value").html(build.stats.overall);
		$el.find(".stat.hp .stat-value").html(build.stats.hp);
		$el.find(".stat.atk .stat-value").html(build.stats.atk);
		$el.find(".stat.def .stat-value").html(build.stats.def);
		$el.find(".stat.spa .stat-value").html(build.stats.spA);
		$el.find(".stat.spd .stat-value").html(build.stats.spD);
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

		build = new Build(pokemonId);

		$el.find(".poke-select").hide();
		$el.find(".details").show();

		self.update();
	});

	// Clear build

	$el.find(".selected-pokemon .remove").on("click", function(e){
		e.preventDefault();
		self.clear();
	});

}
