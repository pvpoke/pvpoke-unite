/*
*  Loads and manages favorite builds from local storage
*/


var Favorites = (function () {
    var instance;

    function createInstance(interface) {
        var object = new Object();

		object.list = []; // List of objects containing build ID's and build strings

		// Add a build to the favorites list, checking for duplicate ID's
		object.addBuildToFavorites = function(build){
			let buildId = build.setBuildId();
			console.log(buildId);

			while(object.getBuildById(buildId)){
				buildId = build.setBuildId();
			}

			object.list.push({
				id: buildId,
				str: build.generateURLString()
			});

			console.log(object.list);

			object.saveFavoriteBuilds();
		}

		// Add a build to the favorites list, checking for duplicate ID's
		object.saveBuildChanges = function(build){

			// Find build with the same ID
			for(var i = 0; i < object.list.length; i++){
				if(object.list[i].id == build.buildId){
					object.list[i].str = build.generateURLString();

					break;
				}
			}

			console.log(object.list);

			object.saveFavoriteBuilds();
		}

		// Remove a build from favorites by buildId
		object.deleteFavoriteBuild = function(buildId){

			// Find build with the same ID
			for(var i = 0; i < object.list.length; i++){
				if(object.list[i].id == buildId){
					object.list.splice(i, 1);
					break;
				}
			}

			object.saveFavoriteBuilds();
		}

		// Return a build from the list with the given build ID, or false if not found
		object.getBuildById= function(buildId){
			for(var i = 0; i < object.list.length; i++){
				if(object.list[i].id == buildId){
					return object.list[i];
				}
			}

			return false;
		}

		// Save current list to local storage
		object.saveFavoriteBuilds = function(){
			let json = JSON.stringify(object.list);

			window.localStorage.setItem("uniteFavoriteBuilds", json);
		}

		// Load favorites list from local storage
		object.loadFavoriteBuilds = function(){
			if(window.localStorage.getItem("uniteFavoriteBuilds")){
				object.list = JSON.parse(window.localStorage.getItem("uniteFavoriteBuilds"));
				console.log("favorites loaded");
				console.log(object.list);
			}
		}

		// For testing purposes, clear the favorites selection
		object.clearFavoriteBuilds = function(){
			window.localStorage.setItem("uniteFavoriteBuilds", JSON.stringify([]));
		}

		object.loadFavoriteBuilds();

        return object;
    }

    return {
        getInstance: function (interface) {
            if (!instance) {
                instance = createInstance(interface);
            }
            return instance;
        }
    };
})();
