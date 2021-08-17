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

	let selectWindow = null; // Modal window for selecting items and moves

	if(selectors){
		buildSelectors = selectors;
	}

	this.init = function(){

		$.each(gm.pokemon, function(n, poke){
			let $pokeEl = $el.find(".pokemon-list .pokemon.template").clone().removeClass("template");

			$pokeEl.find(".name").html(poke.pokemonId);
			$pokeEl.find(".image-container").attr("role", poke.role);
			$pokeEl.find(".image").css("background-image", "url(../img/pokemon/"+poke.pokemonId+".png)");
			$pokeEl.attr("pokemon-id", poke.pokemonId);
			$el.find(".pokemon-list").append($pokeEl);
		});

		$pokeSearch.val("");
	}

	// Clear the currently selected build and open Pokemon select

	self.clear = function(){
		build = null;
		$el.find(".details").hide();
		$el.find(".poke-select").show();
		$el.find(".poke-select input").val('');
		$el.find(".poke-select .pokemon").show();
	}

	// Update displayed stats, moves, and items from the selected build

	self.update = function(internal){
		internal = typeof internal !== 'undefined' ? internal : true;

		if(! build){
			$el.find(".poke-select").show();
			$el.find(".details").hide();
			return false;
		} else{
			$el.find(".poke-select").hide();
			$el.find(".details").show();
		}

		// Display Pokemon's name and image
		$el.find(".selected-pokemon .name").html(build.stageId);

		// Display Pokemon's role and type
		$el.find(".attributes").html("");
		$el.find(".attributes").append("<div>"+build.role+"</div>");
		$el.find(".attributes").append("<div>"+build.type+"</div>");
		$el.find(".attributes").append("<div>"+build.style+"</div>");

		// Display current level
		$el.find(".level .value").html(build.level);

		// Display pokemon image
		$el.find(".selected-pokemon .image").css("background-image", "url(../img/pokemon/"+build.stageId+".png)");
		$el.find(".selected-pokemon").attr("role", build.role);

		// Display Pokemon's stats
		let statsToDisplay = ["hp", "atk", "def", "spA", "spD", "speed"];

		for(var i = 0; i < statsToDisplay.length; i++){
			let key = statsToDisplay[i];
			let stat = build.stat(key, true);
			let baseStat = build.stats[key].parts[0].value; // Whew
			let selector = ".stat."+key.toLowerCase()+" .stat-value"

			$el.find(selector).html(stat);
			if(stat > baseStat){
				$el.find(selector).addClass("boosted");
			} else{
				$el.find(selector).removeClass("boosted");
			}

		}

		// Display comparison stats
		$el.find(".stat-difference").html("");
		$el.find(".stat-difference").css("opacity", 0);

		if((context == "builds")&&(buildSelectors)){

			let primary = buildSelectors[0].getBuild();
			let statsToCompare = [
				{ "stat": "hp", "element": ".stat.hp" },
				{ "stat": "atk", "element": ".stat.atk" },
				{ "stat": "def", "element": ".stat.def" },
				{ "stat": "spA", "element": ".stat.spa" },
				{ "stat": "spD", "element": ".stat.spd" }
			];

			if((primary != build) && primary){

				for(var i = 0; i < statsToCompare.length; i++){
					let diff = build.stats[statsToCompare[i].stat].value - primary.stats[statsToCompare[i].stat].value;
					let displayStr = displayFloat(diff, 1);

					if(diff > 0){
						displayStr = "+" + displayStr;
					}

					$el.find(statsToCompare[i].element + " .stat-difference").removeClass("positive negative");
					$el.find(statsToCompare[i].element + " .stat-difference").html(displayStr);

					if(diff > 0){
						$el.find(statsToCompare[i].element + " .stat-difference").addClass("positive");
						$el.find(statsToCompare[i].element + " .stat-difference").css("opacity", 1);
					} else if(diff < 0){
						$el.find(statsToCompare[i].element + " .stat-difference").addClass("negative");
						$el.find(statsToCompare[i].element + " .stat-difference").css("opacity", 1);
					} else if(diff == 0){
						$el.find(statsToCompare[i].element + " .stat-difference").html('');
						$el.find(statsToCompare[i].element + " .stat-difference").css("opacity", 0);
					}

				}
			}

			// Bubble up to other build selectors

			if((context == "builds")&&(internal)){
				interface.selectorUpdateHandler(self);
			}
		}

		// Display held items
		$el.find(".held-item").html("+");

		for(var i = 0; i < build.heldItems.length; i++){
			$el.find(".held-item").eq(i).html(build.heldItems[i].itemName);
		}

		// Display battle item
		if(build.battleItem){
			$el.find(".battle-item .name").html(build.battleItem.itemName);
		}

		// Display moves
		for(var key in build.moves){
			if(build.moves.hasOwnProperty(key)){
				$el.find(".move[slot=\""+key+"\"] .name").html(build.moves[key].moveName);
			}
		}

		// Display share link
		$el.find(".share-link input").val(host + "builds/" + build.generateURLString());

		// Draw progression graph

		let xAxisMax = 15;
		let yAxisMax = 1200;
		let width = statCanvas.width;
		let height = statCanvas.height;

		if(selectedStat == "hp"){
			yAxisMax = 13000;
		}

		statCtx.clearRect(0, 0, width, height);

		// Draw gridlines
		let gridCount = 7;

		statCtx.lineWidth = 1;
		statCtx.strokeStyle = "#222222";

		statCtx.beginPath();

		for(var i = 0; i < gridCount; i++){
			let x = (width / gridCount) * i;
			statCtx.moveTo(x, 0);
			statCtx.lineTo(x, height);

		}

		statCtx.stroke();
		statCtx.closePath();

		// Draw level line

		statCtx.lineWidth = 1;
		statCtx.strokeStyle = "#888888";
		statCtx.setLineDash([5, 3]);
		let levelX = (build.level-1) * (width / 14);

		statCtx.beginPath();
		statCtx.moveTo(levelX, 0);
		statCtx.lineTo(levelX, height);
		statCtx.stroke();
		statCtx.closePath();

		// Draw stat graph
		statCtx.lineWidth = 4;
		statCtx.strokeStyle = "#9950c5";
		statCtx.setLineDash([]);

		statCtx.beginPath();

		// Calculate stat at each level
		for(var i = 0; i < 15; i++){
			let stats = build.calculateStats(i+1);
			let x = width * (i / 14);
			let y = height - (height * (stats[selectedStat].value / yAxisMax));

	        statCtx.lineTo(x, y);
		}

		statCtx.stroke();
		statCtx.closePath();

		// Match level slider if not equal
		if($el.find(".level-slider").val() != build.level){
			$el.find(".level-slider").val(build.level);
		}
	}

	// Callback function for the SelectWindow to trigger when selecting a held item

	self.selectHeldItem = function(itemId, itemIndex){
		let item = new HeldItem(itemId);
		build.giveHeldItem(item, itemIndex);

		self.update();
	}

	// Callback function for the SelectWindow to trigger when selecting a held item

	self.selectBattleItem = function(itemId){
		let item = new BattleItem(itemId);
		build.giveBattleItem(item);

		self.update();
	}

	// Callback function for the SelectWindow to trigger when selecting a move

	self.selectMove = function(moveId, moveSlot){
		if((moveSlot == "slot1")||(moveSlot == "slot2")){
			build.selectMove(moveId, moveSlot);

			self.update();
		}
	}


	// Return the currently selected build

	self.getBuild = function(){
		return build;
	}

	// Set a build

	self.setBuild = function(value){
		build = value;
		self.update(false);
	}

	// Return the currently graphed stat

	self.getSelectedStat = function(){
		return selectedStat;
	}

	// Externally set the selected stat

	self.setSelectedStat = function(value){
		selectedStat = value;

		$el.find(".stat-label").removeClass("selected");
		$el.find(".stat-label[value=\""+value+"\"]").addClass("selected");
	}

	// Externally set the build level

	self.setLevel = function(value){
		build.setLevel(value);
		$el.find(".level-slider").val(value);
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
		let level = 1;

		if(context == "builds"){
			// Set new build level to the primary or first available build
			for(var i = 0; i < buildSelectors.length; i++){
				if(buildSelectors[i].getBuild()){
					level = buildSelectors[i].getBuild().level;
					break;
				}
			}
		}


		build = new Build(pokemonId, level);

		self.update();
	});

	// Select a stat to display

	$el.find(".stat-label").on("click", function(e){
		$el.find(".stat-label").removeClass("selected");
		$(this).addClass("selected");

		selectedStat = $(this).attr("value");

		self.update();
	});

	// Adjust the build level

	$el.find(".level-slider").on("input", function(e){
		let level = parseInt($(this).val());

		build.setLevel(level);
		self.update();
	});

	// Open the held item select modal window

	$el.find(".held-item").on("click", function(e){
		let itemIndex = $el.find(".held-item").index($(e.target).closest(".held-item"));

		// Preselect any currently selected items
		let selectedItem = null;

		if(itemIndex < build.heldItems.length){
			selectedItem = build.heldItems[itemIndex];
		}

		selectWindow = new SelectWindow($el.find(".held-item-modal"), "held", build, self.selectHeldItem, itemIndex, selectedItem);
	});

	// Open the held item select modal window

	$el.find(".battle-item").on("click", function(e){

		// Preselect any currently selected items
		let selectedItem = build.battleItem;

		selectWindow = new SelectWindow($el.find(".held-item-modal"), "battle", build, self.selectBattleItem, -1, selectedItem);
	});

	// Open the move select modal window

	$el.find(".move").on("click", function(e){

		let slot = $(e.target).closest(".move").attr("slot");

		// Preselect any currently selected items
		let selectedItem = build.moves[slot];

		selectWindow = new SelectWindow($el.find(".held-item-modal"), "move", build, self.selectMove, slot, selectedItem);
	});

	// Bubble up to duplicate this build

	$el.find("a.duplicate").on("click", function(e){
		e.preventDefault();
		if(context == "builds"){
			interface.duplicateBuild(self);
		}
	});

	// Bubble up to delete this build

	$el.find("a.delete").on("click", function(e){
		e.preventDefault();
		if(context == "builds"){
			interface.deleteBuild(self);
		}
	});


	// Clear build

	$el.find(".selected-pokemon .remove").on("click", function(e){
		e.preventDefault();
		self.clear();
	});

}
