// JavaScript Document

var InterfaceMaster = (function () {
    var instance;

    function createInstance() {


        var object = new interfaceObject();

		function interfaceObject(){

			let self = this;
			let team;
			let modal;
			let buildSelector;
			let selectedLane;
			let selectedBuild;
			let selectMode = "add";

			this.init = function(){
				console.log("interface init");

				if(get){
					self.loadGetData();
				} else{
					team = new Team("format5v5");
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
					let $pokeEl = createPokemonSquare(pokemon[i]);
					$pokeEl.insertBefore($lane.find(".pokemon.add"));
				}

				if(team.isLaneFull(laneId)){
					$lane.find(".pokemon.add").hide();
				} else{
					$lane.find(".pokemon.add").show();
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

			// Open up the modal window to add a new Pokemon

			$("body").on("click", ".pokemon.add", function(e){
				selectedLane = $(this).closest(".lane").attr("lane-id");

				modal = new ModalWindow($(".build-template"), msg("teams_select_pokemon"));

				buildSelector = new BuildSelect($(".modal .build-select"), "teams");
				buildSelector.init();

				selectMode = "add";
			});

			// Open up the modal window to edit a Pokemon

			$("body").on("click", ".pokemon:not(.add)", function(e){
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
