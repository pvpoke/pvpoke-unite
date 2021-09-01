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
					team = new Team("format_general");
					console.log(team);

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
					let ratings = self.calculatePokemonSynergy(pokemon);
					self.displayStars($lane.find(".synergy-meter"), ratings, pokemon);


					console.log(ratings);

					// Display full team synergy
					let teamRatings = self.calculatePokemonSynergy(team.pokemon);
					self.displayStars($(".top-team-panel .synergy-meter"), ratings, pokemon);


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

							case "builds":

							break;
						}
					}
				}
			}

			// When the view state changes, push to browser history so it can be navigated forward or back

			this.pushHistoryState = function(){

				let url = webRoot+"teams/";
				let buildStrArr = [];

				for(var i = 0; i < buildSelectors.length; i++){
					let build = buildSelectors[i].getBuild();

					if(build){
						buildStrArr.push(build.generateURLString(true));
					}
				}

				let buildStr = buildStrArr.join(",");

				url = url + buildStr;


				let data = {builds: buildStr};

				window.history.pushState(data, "Builds", url);

				// Send Google Analytics pageview

				/*gtag('config', UA_ID, {page_location: (host+url), page_path: url});
				gtag('event', 'Lookup', {
				  'event_category' : 'Rankings',
				  'event_label' : speciesId
			  });*/
			}


			// Called by BuildSelect when a Pokemon is selected

			this.selectNewPokemon = function(build){
				if(selectMode == "add"){
					team.addPokemon(build, selectedLane);
				} else if(selectMode == "edit"){
					team.replacePokemon(selectedBuild, selectedLane, build)
				}

				modal.close();
				self.updateLane(selectedLane);
			}

			// Remove a Pokemon when the X button is clicked
			this.removePokemon = function(e){
				let pokemonId = $(e.target).closest(".pokemon").attr("pokemon-id");
				selectedLane = $(e.target).closest(".lane").attr("lane-id");

				let index =  $(e.target).closest(".lane").find(".pokemon").index($(e.target).closest(".pokemon"));

				team.removePokemon(selectedLane, index);

				self.updateLane(selectedLane);
			}

			// Calculate synergy with an array of Pokemon
			this.calculatePokemonSynergy = function(pokemon){
				// Initialize the synergy scores from the Pokemon's ratings
				let ratings = {};
				let categoryCount = 0;

				for(var key in pokemon[0].ratings){
					if(pokemon[0].ratings.hasOwnProperty(key)){
						ratings[key] = 0;
						categoryCount++;
					}
				}

				// For each Pokemon, add ratings to the cumuluative score
				for(var i = 0; i < pokemon.length; i++){
					for(var key in ratings){
						if(pokemon[i].ratings.hasOwnProperty(key)){
							ratings[key] += pokemon[i].ratings[key];
						}
					}
				}

				// Calculate overall synergy as the value of stars missing from the combined total
				let ratingCap = 5 + (2.5 * (pokemon.length - 2)); // The number of stars expected for perfect synergy in each category
				let synergyScore = categoryCount * ratingCap;

				for(var key in ratings){
					if(ratings.hasOwnProperty(key)){
						let synergy = ratingCap - ratings[key];

						if(synergy > 0){
							synergyScore -= synergy; // Subtract the difference from overall synergy
						}
					}
				}

				ratings.overall = synergyScore;
				ratings.overallCap = (categoryCount * ratingCap);

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

					let synergy = self.calculatePokemonSynergy(arr);
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
								let synergy = self.calculatePokemonSynergy([pokeA, pokeB]);
								results.push({a: pokeA.pokemonId, b: pokeB.pokemonId, synergy: synergy.overall});
								completedCombos.push(comboName);
							}
						}
					});
				});

				results.sort((a,b) => (a.synergy > b.synergy) ? -1 : ((b.synergy > a.synergy) ? 1 : 0));

				console.log(results);

				let csv = 'Pokemon A,Pokemon B,Synergy\n';

				for(var i = 0; i < results.length; i++){
					csv += results[i].a + ',' + results[i].b + ',' + results[i].synergy + '\n';
				}

				console.log(csv);
			}

			// Displays stars in a synergy meter given ratings and the list of Pokemon

			this.displayStars = function($meter, ratings, pokemon){
				$meter.find(".stars").html("");

				// Adjust this to a scale of 5
				//let floor = ratings.overallCap - (7 + (0.5 * (pokemon.length - 3)));
				let floor = 18 + (12.5 * (pokemon.length - 2));
				let ceiling = 25 + (12.5 * (pokemon.length - 2));
				let stars = (ratings.overall - floor) / (ratings.overallCap - floor); // Maximum possible is 25
				stars = Math.round(stars * 10) / 2;

				if(pokemon.length == 1){
					stars = 0;
				}

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

			// Set a new format

			this.setFormat = function(formatId){
				team = new Team(formatId);
				self.refreshAllLanes();
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

				self.updateLane(selectedLane);
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
