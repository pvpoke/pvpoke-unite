// JavaScript Document

var InterfaceMaster = (function () {
    var instance;

    function createInstance() {


        var object = new interfaceObject();

		function interfaceObject(){

			let self = this;
			let buildSelectors = [];
			let lockSettings = true;

			this.init = function(){
				console.log("interface init");

				if(! get){
					self.addNewBuild();
				} else{
					self.loadGetData();
				}

				// Loads history data on forward and backward navigation
				window.addEventListener('popstate', function(e) {
					get = e.state;
					self.loadGetData();
				});
			};

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
								// Clear any existing builds
								buildSelectors = [];
								$(".build-list .build-select").remove();

								let arr = val.split(",");

								for(var i = 0; i < arr.length; i++){
									let build = generateBuildFromString(arr[i]);

									if(build){
										self.addNewBuild(build);
									}
								}

								break;
						}
					}
				}

				// Refresh all selectors to show relative stats
				self.selectorUpdateHandler(buildSelectors[0], false);
			}

			// Add a new build to the list

			this.addNewBuild = function(build){
				let $buildSelect = $(".build-template .build-select").clone();
				$buildSelect.insertBefore(".build-list .new-build-section");

				let buildSelector = new BuildSelect($buildSelect, "builds", buildSelectors);
				buildSelector.init();

				buildSelectors.push(buildSelector);

				// Prefill an existing build
				if(build){
					buildSelector.setBuild(build);
				}
			}

			// This triggers when updates are made to child update selectors.
			// It syncs selector settings like level and the graphed stat.

			this.selectorUpdateHandler = function(source, pushHistory){
				pushHistory = typeof pushHistory !== 'undefined' ? pushHistory : true;

				let build = source.getBuild();
				let selectedStat = source.getSelectedStat();
				let level = build.level;
				let isPrimary = (source == buildSelectors[0]);

				// Sync settings between selectors

				if(lockSettings){
					for(var i = 0; i < buildSelectors.length; i++){
						let selector = buildSelectors[i];

						if(selector.getBuild()){
							selector.setLevel(level);
							selector.setSelectedStat(selectedStat);
							selector.update(false);
						}
					}
				}

				// Update the other selectors when the primary selector is changed

				if(isPrimary){
					for(var i = 1; i < buildSelectors.length; i++){
						buildSelectors[i].update(false);
					}
				}

				if(pushHistory){
					self.pushHistoryState();
				}
			}

			// When the view state changes, push to browser history so it can be navigated forward or back

			this.pushHistoryState = function(){

				let url = webRoot+"builds/";
				let buildStrArr = [];

				for(var i = 0; i < buildSelectors.length; i++){
					let build = buildSelectors[i].getBuild();

					if(build){
						buildStrArr.push(build.generateURLString());
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

			// Event handler for new build button

			$("a.new-build").click(function(e){
				e.preventDefault();

				self.addNewBuild();
			});

			// Toggle lock settings on or off

			$("button.lock-settings").click(function(e){
				lockSettings = (! lockSettings);
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
