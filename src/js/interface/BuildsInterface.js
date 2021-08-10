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

				self.addNewBuild();
			};


			// Add a new build to the list

			this.addNewBuild = function(){
				let $buildSelect = $(".build-template .build-select").clone();
				$buildSelect.insertBefore(".build-list .new-build-section");

				let buildSelector = new BuildSelect($buildSelect, "builds", buildSelectors);
				buildSelector.init();

				buildSelectors.push(buildSelector);
			}

			// This triggers when updates are made to child update selectors.
			// It syncs selector settings like level and the graphed stat.

			this.selectorUpdateHandler = function(source){
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
			}

			// Event handler for new build button

			$("a.new-build").click(function(e){
				e.preventDefault();

				self.addNewBuild();
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
