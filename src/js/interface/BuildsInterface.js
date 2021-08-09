// JavaScript Document

var InterfaceMaster = (function () {
    var instance;

    function createInstance() {


        var object = new interfaceObject();

		function interfaceObject(){

			let self = this;
			let buildSelectors = [];

			this.init = function(){
				console.log("interface init");

				self.addNewBuild();
			};


			this.addNewBuild = function(){
				let $buildSelect = $(".build-template .build-select").clone();
				$buildSelect.insertBefore(".build-list .new-build-section");

				let buildSelector = new BuildSelect($buildSelect, "builds");
				buildSelector.init();

				buildSelectors.push(buildSelector);
			}


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
