// JavaScript Document

var InterfaceMaster = (function () {
    var instance;

    function createInstance() {


        var object = new interfaceObject();

		function interfaceObject(){

			let self = this;
			let team;

			this.init = function(){
				console.log("interface init");

				if(get){
					self.loadGetData();
				} else{
					team = new Team("format5v5");
					console.log(team);

					self.updateAllLanes();
				}

				// Loads history data on forward and backward navigation
				window.addEventListener('popstate', function(e) {
					get = e.state;
					self.loadGetData();
				});
			};

			// Completely refresh the lanes section

			this.updateAllLanes = function(){
				$(".lanes").html("");

				for(var key in team.lanes){
					if(team.lanes.hasOwnProperty(key)){
						let lane = team.lanes[key];

						let $lane = $(".lane.template").clone().removeClass("template");
						$lane.find(".header .name").html(msg(lane.laneId));
						$(".lanes").append($lane);
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
