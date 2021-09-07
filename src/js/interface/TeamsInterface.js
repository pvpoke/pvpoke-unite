// JavaScript Document

var InterfaceMaster = (function () {
    var instance;

    function createInstance() {


        var object = new interfaceObject();

		function interfaceObject(){

			let self = this;
			let gm = GameMaster.getInstance();
			let team;
			let modal;
			let buildSelector;
			let selectedLane;
			let selectedBuild;
			let selectMode = "add";

			let synergyScale = 7;

			this.init = function(){
				console.log("interface init");

				if(get){
					self.loadGetData();
				} else{
					team = new Team("general");
					self.refreshAllLanes();
				}

				// Loads history data on forward and backward navigation
				window.addEventListener('popstate', function(e) {
					get = e.state;
					self.loadGetData();
				});
			};

			// Completely refresh the lanes section

			this.refreshAllLanes = function(){
				$(".lanes").html("");
				$(".synergy-meter .stars").html("");
				$(".top-team-panel .synergy").hide();

				for(var key in team.lanes){
					if(team.lanes.hasOwnProperty(key)){
						let lane = team.lanes[key];

						let $lane = $(".lane.template").clone().removeClass("template");
						$lane.find(".header .name").html(msg(lane.laneId));
						$lane.attr("lane-id", lane.laneId);

						$(".lanes").append($lane);
					}
				}
			}

			// Update Pokemon and recommended for all lanes
			this.updateAllLanes = function(pushHistory){
				pushHistory = typeof pushHistory !== 'undefined' ? pushHistory : true;

				for(var key in team.lanes){
					if(team.lanes.hasOwnProperty(key)){
						self.updateLane(key);
					}
				}

				// Display full team synergy
				if((team.pokemon.length > 0)&&(team.getFormat().id != "general")){
					let teamRatings = self.calculateSynergy(team.pokemon);
					self.displayStars($(".top-team-panel .synergy-meter"), teamRatings, team.pokemon);
					$(".top-team-panel .synergy").css("display", "flex");
				} else{
					$(".top-team-panel .synergy").hide();
				}


				if(pushHistory){
					self.pushHistoryState();
				}
			}

			// Update the Pokemon display of a particular lane

			this.updateLane = function(laneId){
				let $lane = $(".lane[lane-id=\""+laneId+"\"]");
				let pokemon = team.getPokemonList(laneId);

				$lane.find(".pokemon:not(.add)").remove();

				for(var i = 0; i < pokemon.length; i++){
					let $pokeEl = createPokemonSquare(pokemon[i], "teams");
					$pokeEl.insertBefore($lane.find(".pokemon.add"));
				}

				if(team.isLaneFull(laneId)){
					$lane.find(".pokemon.add").hide();
					$lane.find(".recommended-section").css("visibility", "hidden");
				} else{
					$lane.find(".pokemon.add").show();
					if(pokemon.length > 0){
						$lane.find(".recommended-section").css("visibility", "visible");
					} else{
						$lane.find(".recommended-section").css("visibility", "hidden");
					}
				}

				// Display Synergy meter
				if(pokemon.length > 0){

					// Display lane synergy
					let ratings = self.calculateSynergy(pokemon);
					self.displayStars($lane.find(".synergy-meter"), ratings, pokemon);

					// Get recommendations
					let recommendations = self.generateComboSynergy(pokemon);

					for(var i = 0; i < 5; i++){
						let pokemon = gm.getPokemonById(recommendations[i].pokemonId);
						let $pokeEl = createPokemonSquare(pokemon, "recommended");
						$lane.find(".recommended.pokemon-list").append($pokeEl);
					}
				} else{
					$lane.find(".synergy-meter .stars").html("");

					if(team.pokemon.length == 0){
						$(".synergy-meter .stars").html("");
					}
				}
			}

			// Load data from URL

			this.loadGetData = function(){
				if(! get){
					return false;
				}

				// Cycle through parameters and set them

				for(var key in get){
					if(get.hasOwnProperty(key)){

						let val = get[key];

						// Process each type of parameter

						switch(key){

							case "team":

							team = generateTeamFromString(val);
							break;
						}
					}
				}

				$(".format-select option[value=\""+team.getFormat().id+"\"]").prop("selected", "selected");

				self.refreshAllLanes();
				self.updateAllLanes(false);
			}

			// When the view state changes, push to browser history so it can be navigated forward or back

			this.pushHistoryState = function(){
				let teamStr = team.generateURLString();
				let url = webRoot+"teams/" + teamStr;


				let data = {team: teamStr};

				window.history.pushState(data, "Teams", url);
			}


			// Called by BuildSelect when a Pokemon is selected

			this.selectNewPokemon = function(build){
				if(selectMode == "add"){
					team.addPokemon(build, selectedLane);
				} else if(selectMode == "edit"){
					team.replacePokemon(selectedBuild, selectedLane, build)
				}

				// Record analytics event for the pokemon and lane selected
				gtag('event', build.pokemonId, {
				  'event_category' : 'Pokemon Select',
				  'lane': selectedLane
				});

				modal.close();
				self.updateAllLanes();
			}

			// Remove a Pokemon when the X button is clicked
			this.removePokemon = function(e){
				let pokemonId = $(e.target).closest(".pokemon").attr("pokemon-id");
				selectedLane = $(e.target).closest(".lane").attr("lane-id");

				let index =  $(e.target).closest(".lane").find(".pokemon").index($(e.target).closest(".pokemon"));

				team.removePokemon(selectedLane, index);

				self.updateAllLanes();
			}

			// Calculate synergy with an array of Pokemon
			this.calculateSynergy = function(pokemon){
				// Initialize the synergy scores from the Pokemon's ratings
				let ratings = {};
				let ratingParts = {}; // Store how much each Pokemon contributes
				let categoryCaps = {}; // The maximum stars expected for each category
				let totalCap = 0;
				let categoryCount = 0;

				for(var key in pokemon[0].ratings){
					if(pokemon[0].ratings.hasOwnProperty(key)){
						ratings[key] = 0;
						ratingParts[key] = [];
						categoryCaps[key] = 5 + (2.5 * (pokemon.length - 2));

						if(key == "support"){
							categoryCaps[key] = 5 + (1.5 * (pokemon.length - 2));
						}

						if(pokemon.length == 1){
							categoryCaps[key] = 5;
						}

						totalCap += categoryCaps[key];

						categoryCount++;
					}
				}

				// For each Pokemon, add ratings to the cumuluative score
				for(var i = 0; i < pokemon.length; i++){
					for(var key in ratings){
						if(pokemon[i].ratings.hasOwnProperty(key)){
							ratings[key] += pokemon[i].ratings[key];

							ratingParts[key].push({
								pokemonId: pokemon[i].pokemonId,
								role: pokemon[i].role,
								value: pokemon[i].ratings[key]
							});
						}
					}
				}

				// Calculate overall synergy as the value of stars missing from the combined total
				let synergyScore = totalCap;

				for(var key in ratings){
					if(ratings.hasOwnProperty(key)){
						let synergy = categoryCaps[key] - ratings[key];

						if(synergy > 0){
							synergyScore -= synergy; // Subtract the difference from overall synergy
						}
					}
				}

				ratings.overall = synergyScore;
				ratings.overallCap = totalCap;
				ratings.categoryCaps = categoryCaps;
				ratings.parts = ratingParts;

				return ratings;
			}

			// Calculate synergy for all Pokemon added to a provided array
			this.generateComboSynergy = function(pokemon){
				let results = [];
				let startArr = [];

				for(var i = 0; i < pokemon.length; i++){
					startArr.push(pokemon[i].pokemonId);
				}

				$.each(gm.pokemon, function(n, poke){
					if(team.hasPokemon(poke.pokemonId)){
						return;
					}

					let arr = pokemon.slice();
					arr.push(poke);

					let synergy = self.calculateSynergy(arr);
					results.push({pokemonId: poke.pokemonId, synergy:synergy.overall});
				});

				results.sort((a,b) => (a.synergy > b.synergy) ? -1 : ((b.synergy > a.synergy) ? 1 : 0));

				return results;
			}

			// Calculate synergy for all Pokemon combinations
			this.generateAllPokemonSynergy = function(){
				let results = [];
				let completedCombos = [];

				$.each(gm.pokemon, function(i, pokeA){
					$.each(gm.pokemon, function(n, pokeB){
						if(pokeB != pokeA){
							let comboNames = [pokeA.pokemonId, pokeB.pokemonId];
							comboNames.sort((a,b) => (a > b) ? -1 : ((b > a) ? 1 : 0));

							let comboName = comboNames.join("");

							if(completedCombos.indexOf(comboName) == -1){
								let synergy = self.calculateSynergy([pokeA, pokeB]);
								results.push({a: pokeA.pokemonId, b: pokeB.pokemonId, synergy: synergy.overall});
								completedCombos.push(comboName);
							}
						}
					});
				});

				results.sort((a,b) => (a.synergy > b.synergy) ? -1 : ((b.synergy > a.synergy) ? 1 : 0));

				let csv = 'Pokemon A,Pokemon B,Synergy\n';

				for(var i = 0; i < results.length; i++){
					csv += results[i].a + ',' + results[i].b + ',' + results[i].synergy + '\n';
				}
			}

			// Displays stars in a synergy meter given ratings and the list of Pokemon

			this.displayStars = function($meter, ratings, pokemon){
				$meter.find(".stars").html("");

				let floor = 18 + (12.5 * (pokemon.length - 2));
				let ceiling = 25 + (12.5 * (pokemon.length - 2));
				let stars = (ratings.overall - floor) / (ratings.overallCap - floor);

				// Adjust to a scale of 5
				stars = Math.round(stars * 10) / 2;

				if(stars > 5){
					stars = 5; // This shouldn't ever happen if the formula is good but just in case
				}

				for(var i = 0; i < Math.floor(stars); i++){
					$meter.find(".stars").append($("<div class=\"star\"></div>"));
				}

				if(stars % 1 == 0.5){
					$meter.find(".stars").append($("<div class=\"star half\"></div>"));
				}
			}

			// Open a new modal window to display synergy details given an array of Pokemon
			this.openSynergyDetails = function(pokemon){
				let ratings = self.calculateSynergy(pokemon);
				let $details = $(".synergy-modal.template").first().clone().removeClass("template");
				let modal = new ModalWindow($details, msg("synergy"));
				let parts = ratings.parts;

				// Display Pokemon list
				for(var i = 0; i < parts["offense"].length; i++){
					let $pokeEl = createPokemonSquare(parts["offense"][i]);
					$(".modal .synergy-modal .pokemon-list").append($pokeEl);
				}


				// Display bars
				for(var key in parts){
					if(parts.hasOwnProperty(key)){
						let $section = $(".synergy-detail.template").first().clone().removeClass("template");
						$section.find(".label").html(msg(key));

						for(var i = 0; i < parts[key].length; i++){
							let $bar = $('<div class="bar role-bg"></div>');
							let width = (parts[key][i].value / ratings.categoryCaps[key]) * 100;
							$bar.attr("role", parts[key][i].role);
							$bar.css("width", width+"%");
							$section.find(".star-number").html(ratings[key]);
							$section.find(".bars").append($bar);
						}

						$(".modal .synergy-details").append($section);
					}
				}
			}

			// Set a new format

			this.setFormat = function(formatId){
				team = new Team(formatId);
				self.refreshAllLanes();
			}

			// Return the current team
			this.getTeam = function(){
				return team;
			}

			// Open up the modal window to add a new Pokemon

			$("body").on("click", ".lane .pokemon.add", function(e){
				selectedLane = $(this).closest(".lane").attr("lane-id");

				modal = new ModalWindow($(".build-template"), msg("teams_select_pokemon"));

				buildSelector = new BuildSelect($(".modal .build-select"), "teams");
				buildSelector.init();

				selectMode = "add";
			});

			// Open up the modal window to edit a Pokemon

			$("body").on("click", ".lane .main.pokemon-list .pokemon:not(.add)", function(e){
				if($("a.remove:hover").length > 0){
					e.preventDefault();
					self.removePokemon(e);
					return false;
				}

				let pokemonId = $(this).attr("pokemon-id");
				selectedLane = $(this).closest(".lane").attr("lane-id");

				let build = team.getBuild(pokemonId, selectedLane);

				modal = new ModalWindow($(".build-template"), msg("teams_select_pokemon"));

				buildSelector = new BuildSelect($(".modal .build-select"), "teams");
				buildSelector.init();
				buildSelector.setBuild(build);

				selectMode = "edit";
				selectedBuild = build;
			});

			// Add a new Pokemon from the recommended list

			$("body").on("click", ".lane .recommended.pokemon-list .pokemon", function(e){
				let pokemonId = $(this).attr("pokemon-id");
				selectedLane = $(this).closest(".lane").attr("lane-id");

				let build = new Build(pokemonId);

				team.addPokemon(build, selectedLane);

				self.updateAllLanes();

				// Record analytics event for the pokemon and lane selected
				gtag('event', build.pokemonId, {
				  'event_category' : 'Pokemon Select',
				  'lane': selectedLane
				});
			});

			// Open up the synergy modal window

			$("body").on("click", ".synergy", function(e){
				// Determine if this is a lane or the whole team
				let pokemon = team.pokemon;

				if($(this).closest(".lane").length > 0){
					let laneId = $(this).closest(".lane").attr("lane-id");
					pokemon = team.getPokemonList(laneId);
				}

				self.openSynergyDetails(pokemon);
			});

			// Change the format selection

			$(".format-select").on("change", function(e){
				self.setFormat($(this).find("option:selected").val());
			});

		};

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
