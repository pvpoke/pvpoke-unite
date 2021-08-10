/*
 * Funtionality for the Build selector interface
 */

function BuildSelect(element, ctx, selectors){
	let self = this;
	let $el = element;
	let $pokeSearch = $el.find("input.poke-search");
	let gm = GameMaster.getInstance();
	let build;
	let interface = InterfaceMaster.getInstance();
	let context = ctx;
	let buildSelectors = [];

	let selectedStat = 'hp';
	let statCanvas = $el.find("canvas.progression")[0];
	let statCtx = statCanvas.getContext("2d");

	if(selectors){
		buildSelectors = selectors;
	}

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

		$el.find(".stat.hp .stat-value").html(build.stats.hp);
		$el.find(".stat.atk .stat-value").html(build.stats.atk);
		$el.find(".stat.def .stat-value").html(build.stats.def);
		$el.find(".stat.spa .stat-value").html(build.stats.spA);
		$el.find(".stat.spd .stat-value").html(build.stats.spD);

		// Display comparison stats
		$el.find(".stat-difference").html("");

		if((context == "builds")&&(buildSelectors)){

			let primary = buildSelectors[0].getBuild();

			if(primary != build){
				let statsToCompare = [
					{ "stat": "hp", "element": ".stat.hp" },
					{ "stat": "atk", "element": ".stat.atk" },
					{ "stat": "def", "element": ".stat.def" },
					{ "stat": "spA", "element": ".stat.spa" },
					{ "stat": "spD", "element": ".stat.spd" }
				];

				for(var i = 0; i < statsToCompare.length; i++){
					let diff = build.stats[statsToCompare[i].stat] - primary.stats[statsToCompare[i].stat];
					let displayStr = diff;

					if(diff > 0){
						displayStr = "+" + displayStr;
					}

					$el.find(statsToCompare[i].element + " .stat-difference").removeClass("positive negative");
					$el.find(statsToCompare[i].element + " .stat-difference").html(displayStr);

					if(diff > 0){
						$el.find(statsToCompare[i].element + " .stat-difference").addClass("positive");
					} else if(diff < 0){
						$el.find(statsToCompare[i].element + " .stat-difference").addClass("negative");
					}

				}
			}
		}

		// Draw progression graph

		let xAxisMax = 15;
		let yAxisMax = 1200;
		let width = statCanvas.width;
		let height = statCanvas.height;

		if(selectedStat == "hp"){
			yAxisMax = 13000;
		}

		statCtx.clearRect(0, 0, width, height);
		statCtx.strokeStyle = "#6f55df";
		statCtx.lineWidth = 2;
		statCtx.beginPath();

		// Calculate stat at each level
		for(var i = 0; i < 15; i++){
			let stats = build.calculateStats(i+1);
			let x = width * (i / 14);
			let y = height - (height * (stats[selectedStat] / yAxisMax));

			console.log(stats[selectedStat]);
	        statCtx.lineTo(x, y);
	        statCtx.stroke();
			statCtx.lineTo(x, y);

		}
	}

	// Return the currently selected build

	self.getBuild = function(){
		return build;
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

	// Select a stat to display

	$el.find(".stat-label").on("click", function(e){

		$el.find(".stat-label").removeClass("selected");
		$(this).addClass("selected");

		selectedStat = $(this).attr("value");

		self.update();
	});

}
