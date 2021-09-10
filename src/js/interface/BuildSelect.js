/*
 * Funtionality for the Build selector interface
 */

function BuildSelect(element, ctx, selectors){
	let self = this;
	let $el = element;
	let $pokeSearch = $el.find("input.poke-search");
	let gm = GameMaster.getInstance();
	let favorites = Favorites.getInstance();
	let interface = InterfaceMaster.getInstance();
	let build;
	let context = ctx;
	let buildSelectors = [];

	let selectedStat = 'hp';
	let graph = new ProgressionGraph( $el.find("canvas.progression")[0] );

	let tooltip = Tooltip.getInstance();

	// Used for animating images on level change
	let previousStage = '';

	let selectWindow = null; // Modal window for selecting items and moves

	if(selectors){
		buildSelectors = selectors;
	}

	this.init = function(){
		self.displayNewPokemonList();

		$pokeSearch.val("");
	}

	// Clear the currently selected build and open Pokemon select

	self.clear = function(){
		build = null;
		previousStage = '';
		$el.find(".details").hide();
		$el.find(".poke-select").show();
		$el.find(".poke-select input").val('');
		$el.find(".poke-select .pokemon").show();
		$el.find("a.save-changes").hide();
		$el.find("a.add-to-favorites").hide();
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
		$el.find(".selected-pokemon .name").html(msg(build.stageId));

		// Display Pokemon's role and type
		$el.find(".main-attributes").html("");
		$el.find(".main-attributes").append("<div>"+msg(build.role)+"</div>");
		$el.find(".main-attributes").append("<div>"+msg(build.type)+"</div>");
		$el.find(".main-attributes").append("<div>"+msg(build.style)+"</div>");

		// Display current level
		$el.find(".level .value").html(build.level);

		// Display pokemon image
		$el.find(".selected-pokemon .image").css("background-image", "url("+getAsset(build.stageId, "pokemon", "png")+")");
		$el.find(".selected-pokemon").attr("role", build.role);

		if(previousStage != build.stageId){
			$el.find(".selected-pokemon .image").removeClass("animate");

			setTimeout(function(){
				$el.find(".selected-pokemon .image").addClass("animate");
			}, 25);

			previousStage = build.stageId;
		}


		// Display Pokemon's stats
		let statsToDisplay = ["hp", "atk", "def", "sp_atk", "sp_def", "speed"];

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
				{ "stat": "sp_atk", "element": ".stat.sp_atk" },
				{ "stat": "sp_def", "element": ".stat.sp_def" }
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

			// Update stats graph
			graph.update(build, primary, selectedStat);

			// Bubble up to other build selectors

			if((context == "builds")&&(internal)){
				interface.selectorUpdateHandler(self);
			}
		}

		// Display held items

		for(var i = 0; i < 3; i++){
			if(i < build.heldItems.length){
				$el.find(".held-item").eq(i).html("");
				$el.find(".held-item").eq(i).css("background-image", "url("+getAsset(build.heldItems[i].itemId, "helditems", "png")+")");
			} else{
				$el.find(".held-item").eq(i).html("+");
				$el.find(".held-item").eq(i).css("background-image", "none");
			}
		}

		// Display battle item
		if(build.battleItem){
			$el.find(".battle-item .name").html(build.battleItem.itemName);
			$el.find(".battle-item .image").html("");
			$el.find(".battle-item .image").css("background-image", "url("+getAsset(build.battleItem.itemId, "battleitems", "png")+")");
		} else{
			$el.find(".battle-item .name").html("");
			$el.find(".battle-item .image").html("+");
			$el.find(".battle-item .image").css("background-image", "none");
		}

		// Display moves
		for(var key in build.moves){
			if(build.moves.hasOwnProperty(key)){
				let move = build.moves[key];

				$el.find(".move[slot=\""+key+"\"] .name").html(move.moveName);
				$el.find(".move[slot=\""+key+"\"] .image").attr("color", move.color);
				$el.find(".move[slot=\""+key+"\"] .image .asset").css("background-image", "url("+getAsset(move.assetId, "moves", "png")+")");

				if(move.unlockLevel){
					if(build.level < move.unlockLevel){
						$el.find(".move[slot=\""+key+"\"]").addClass("locked");
					} else{
						$el.find(".move[slot=\""+key+"\"]").removeClass("locked");
					}
				}

				// Display move cooldown
				if(move.cooldown){
					$el.find(".move[slot=\""+key+"\"] .cooldown").html( displayFloat(move.cooldown, 1) + msg("cooldown_abbreviation") );

					if(move.cooldown < move.baseCooldown){
						$el.find(".move[slot=\""+key+"\"] .cooldown").addClass("boosted");
					} else{
						$el.find(".move[slot=\""+key+"\"] .cooldown").removeClass("boosted");
					}
				}
			}
		}

		// Display share link
		$el.find(".share-link input").val(host + "builds/" + build.generateURLString());

		// Show or hide add to favorites menu options
		if(build.isFavorite){
			$el.find("a.add-to-favorites").hide();
			$el.find("a.save-changes").css("display", "block");
			$el.find(".nav-bar .star").show();
		} else{
			$el.find("a.add-to-favorites").css("display", "block");
			$el.find("a.save-changes").hide();
			$el.find(".nav-bar .star").hide();
		}

		// Update team link or build links
		if(context == "builds"){
			let teamURL = host + "teams/general/0/" + build.generateURLString();
			$el.find("a.team-link").attr("href", teamURL);
			$el.find("a.team-link").html(msg("button_team_link", [msg(build.pokemonId)]));
			$el.find(".team-link-section").removeClass("hide");
		} else if(context == "teams"){
			let buildURL = host + "builds/" + build.generateURLString();
			$el.find("a.build-link").attr("href", buildURL);
			$el.find("a.build-link").html(msg("button_build_link", [msg(build.pokemonId)]));
			$el.find(".build-link-section").removeClass("hide");
		}

		// Preload evolution assets
		if(build.stages.length > 1){
			$el.find(".preload").html("");

			for(var i = 0; i < build.stages.length; i++){
				let stageImgUrl = "url(" + getAsset(build.stages[i].stageId, "pokemon", "png") + ")";
				let $preload = $("<div></div>");
				$preload.css("background-image", stageImgUrl);

				$el.find(".preload").append($preload);
			}
		}

		// Match level slider if not equal
		if($el.find(".level-slider").val() != build.level){
			$el.find(".level-slider").val(build.level);
		}
	}

	// Callback function for the SelectWindow to trigger when selecting a held item

	self.selectHeldItem = function(itemId, itemIndex, stacks){
		stacks = typeof stacks !== 'undefined' ? stacks : 1;

		let item = new HeldItem(itemId);
		item.setStacks(stacks);
		build.giveHeldItem(item, itemIndex);


		if(itemId != "none"){
			gtag('event', build.pokemonId, {
			  'event_category' : 'Held Item',
			  'event_label' : itemId
			});
		}

		self.update();
	}

	// Callback function for the SelectWindow to trigger when selecting a held item

	self.selectBattleItem = function(itemId){
		let item = new BattleItem(itemId);
		build.giveBattleItem(item);

		if(itemId != "none"){
			gtag('event', build.pokemonId, {
			  'event_category' : 'Battle Item',
			  'event_label' : itemId
			});
		}

		self.update();
	}

	// Callback function for the SelectWindow to trigger when selecting a move

	self.selectMove = function(moveId, moveSlot){
		if((moveSlot == "slot1")||(moveSlot == "slot2")){
			build.selectMove(moveId, moveSlot);

			// Don't report if it's the first move in the slot
			if(moveId != build.movePool[moveSlot][0].moveId){
				gtag('event', build.pokemonId, {
				  'event_category' : 'Move Select',
				  'event_label' : moveSlot + ' ' + moveId
				});
			}


			self.update();
		}
	}

	// Display the list of new Pokemon by species
	self.displayNewPokemonList = function(){
		 $el.find(".pokemon-list").html("");

		$.each(gm.pokemon, function(n, poke){
			let $pokeEl = createPokemonSquare(poke);

			// Disable existing Pokemon on a team
			if(context == "teams"){
				if(interface.getTeam().hasPokemon(poke.pokemonId)){
					$pokeEl.addClass("disabled");
				}
			}

			$el.find(".pokemon-list").append($pokeEl);
		});
	}

	// Display the list of new Pokemon by species
	self.displayFavoritesList = function(){
		 $el.find(".pokemon-list").html("");

		$.each(favorites.list, function(n, obj){
			let poke = generateBuildFromString(obj.str);
			let $pokeEl = createPokemonSquare(poke, "favorites");

			$pokeEl.attr("build-id", obj.id);
			$pokeEl.attr("build-str", obj.str);

			// Disable existing Pokemon on a team
			if(context == "teams"){
				if(interface.getTeam().hasPokemon(poke.pokemonId)){
					$pokeEl.addClass("disabled");
				}
			}

			$el.find(".pokemon-list").append($pokeEl);
		});
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
			//Match against each word in the name HTML
			let strs = $(this).find(".name").html().split(" ");
			let matches = 0;

			for(var i = 0; i < strs.length; i++){
				if(strs[i].toLowerCase().startsWith(searchStr)){
					matches++;
				}
			}

			if(matches > 0){
				$(this).show();
			} else{
				$(this).hide();
			}
		});
	});

	// Select a Pokemon

	$el.on("click", ".pokemon-list .pokemon", function(e){
		let $pokemon = $(e.target).closest(".pokemon");
		let pokemonId = $pokemon.attr("pokemon-id");
		let level = 10;

		// Check to see if removing a favorite Pokemon
		if($("a.remove:hover").length > 0){
			e.preventDefault();
			let buildId = $pokemon.attr("build-id");

			ModalWindow($el.find(".delete-favorite-modal"));

			$(".modal .delete-favorite-modal").attr("build-id", buildId);

			// Delete the selected build
			$(".modal .delete-favorite-modal .yes").click(function(e){
				favorites.deleteFavoriteBuild(buildId);
				self.displayFavoritesList();
			});
			return false;
		}

		if(context == "builds"){
			// Set new build level to the primary or first available build
			for(var i = 0; i < buildSelectors.length; i++){
				if(buildSelectors[i].getBuild()){
					level = buildSelectors[i].getBuild().level;
					break;
				}
			}
		}

		// If this build has an associated Build ID and string, set them;
		if(! $pokemon.attr("build-id")){
			build = new Build(pokemonId, level);
		} else{
			build = generateBuildFromString($pokemon.attr("build-str"));
			build.setLevel(level);
		}

		// Log a Pokemon selection event

		if(context == "builds"){
			gtag('event', pokemonId, {
			  'event_category' : 'Pokemon Select'
			});
		}

		// Bubble up to the TeamInterface when a Pokemnon is selected
		if(context == "teams"){
			interface.selectNewPokemon(build);
		}

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

	// Bubble up to move this build selector to the front

	$el.find("a.move-to-front").on("click", function(e){
		e.preventDefault();
		if(context == "builds"){
			interface.moveBuildToFront(self);
			$el.find(".submenu").removeClass("active");
		}
	});

	// Save this Pokemon to the favorites list

	$el.find("a.add-to-favorites").on("click", function(e){
		e.preventDefault();
		if(context == "builds"){
			favorites.addBuildToFavorites(build);
			$el.find(".submenu").removeClass("active");
			self.update();
		}
	});

	// Save this Pokemon to the favorites list

	$el.find("a.save-changes").on("click", function(e){
		e.preventDefault();
		if(context == "builds"){
			favorites.saveBuildChanges(build);
		}
	});

	// Select one of the tab options for Pokemon selection
	$el.find(".poke-select .tabs a").on("click", function(e){
		let val = $(this).attr("value");

		if(val == "new"){
			self.displayNewPokemonList();
		} else if(val == "favorites"){
			self.displayFavoritesList();
		}
	});

	// Show tooltip info for stats
	$el.find(".stats .stat-value").on("mouseover", function(e){
		let key = $(this).parent().find(".stat-label").attr("value");

		if(! key)
			return;

		let parts = build.stats[key].parts;
		let $content = $("<div></div>");

		for(var i = 0; i < parts.length; i++){
			if(i > 0){
				$content.append(" + ");
			}
			$content.append("<span class=\"stat-part\"><span class=\"value\">"+parts[i].displayValue+"</span> "+msg(parts[i].source)+"</span>");
		}

		tooltip.setContent($content, "stat-parts");
	});


	// Clear build

	$el.find(".selected-pokemon .remove").on("click", function(e){
		e.preventDefault();
		self.clear();
	});

}
