// JavaScript Document

var InterfaceMaster = (function () {
    var instance;

    function createInstance() {


        var object = new interfaceObject();

		function interfaceObject(){

			let self = this;
			let buildSelectors = [];
			let lockSettings = true;
			let scrollPosition = 0;
			let scrollLocked = false;

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

			this.addNewBuild = function(build, index){
				index = typeof index !== 'undefined' ? index : -1;

				let $buildSelect = $(".build-template .build-select").clone();
				let buildSelector = new BuildSelect($buildSelect, "builds", buildSelectors);
				buildSelector.init();

				if(index == -1){
					$buildSelect.insertBefore(".build-list .new-build-section");
					buildSelectors.push(buildSelector);
				} else{
					let $insertElement = $(".build-list .build-select").eq(index-1);
					$buildSelect.insertAfter($insertElement);
					buildSelectors.splice(index, 0, buildSelector);
				}

				// Prefill an existing build
				if(build){
					buildSelector.setBuild(build);
				}
			}

			// This triggers when updates are made to child update selectors.
			// It syncs selector settings like level and the graphed stat.

			this.selectorUpdateHandler = function(source, pushHistory){
				pushHistory = typeof pushHistory !== 'undefined' ? pushHistory : true;

				let isPrimary = false;

				if(source){
					let build = source.getBuild();
					let selectedStat = source.getSelectedStat();
					let level = build.level;
					isPrimary = (source == buildSelectors[0]);

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
				}


				// Update the other selectors when the primary selector is changed
				if(isPrimary){
					for(var i = 1; i < buildSelectors.length; i++){
						buildSelectors[i].update(false);
					}
				}

				// Update all selectors when no source is provided;
				if(! source){
					for(var i = 0; i < buildSelectors.length; i++){
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

			// This event is triggered from BuildSelect.js when the duplicate button is clicked

			this.duplicateBuild = function(selector){
				let buildStr = selector.getBuild().generateURLString();
				let build = generateBuildFromString(buildStr);

				// Find the index of the selector to slot this in afterward
				let index = 0;

				for(var i = 0; i < buildSelectors.length; i++){
					if(buildSelectors[i] == selector){
						index = i + 1;
						break;
					}
				}

				self.addNewBuild(build, index);
			}

			// This event is triggered from BuildSelect.js when the delete button is clicked

			this.deleteBuild = function(selector){
				// Find the index of the selector to slot this in afterward
				for(var i = 0; i < buildSelectors.length; i++){
					if(buildSelectors[i] == selector){
						$(".build-list .build-select").eq(i).remove();
						buildSelectors.splice(i, 1);
						break;
					}
				}

				self.selectorUpdateHandler(false, true);
			}

			// This event is triggered from BuildSelect.js when the move button is clicked

			this.moveBuildToFront = function(selector){
				// Find the index of the selector to slot this in afterward
				for(var i = 0; i < buildSelectors.length; i++){
					if(buildSelectors[i] == selector){
						buildSelectors.splice(i, 1);
						buildSelectors.unshift(selector);

						let $el = $(".build-list .build-select").eq(i);
						$el.prependTo(".build-list");
						break;
					}
				}

				self.selectorUpdateHandler(false, true);
			}

			// Event handler for new build button

			$("a.new-build").click(function(e){
				e.preventDefault();

				self.addNewBuild();
			});

			// On mobile, lock side to side scrolling while interacting with level sliders

			$("body").on("touchstart", ".level-slider-wrap, .level-slider", function(){
				$(".build-list").css("overflow-x", "hidden");
			});

			$("body").on("touchend", function(){
				$(".build-list").css("overflow-x", "auto");
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
