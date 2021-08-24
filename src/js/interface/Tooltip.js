// Functionality for tooltip interface

var Tooltip = (function () {
    var instance;

    function createInstance(interface) {
        var object = new Object();

		let $tooltip = $(".tooltip");
		let lastHoverTime = 0;

		// Add a build to the favorites list, checking for duplicate ID's
		object.setContent = function($content, context){
			$tooltip.html($content);
			$tooltip.attr("context", context);
		}

		// Show or hide toolip

		$("body").on("mousemove", function(e){

			/*
			* The tooltip has a small delay before it disappears.
			* This prevents the tooltip from flashing on and off when
			* mousing over adjacent but not overlapping tooltip areas.
			*/

			if($(".tooltippable:hover").length > 0){
				lastHoverTime = Date.now();
				$tooltip.show();
			} else{
				if(Date.now() - lastHoverTime > 150){
					$tooltip.hide();
				}
			}

			// Follow the mouse
			if($tooltip.is(":visible")){
				let width = $tooltip.width();
				let left = (e.pageX - $(".section").first().offset().left) + 10;
				let top = e.pageY - 20;

				if( left > ($(".timeline-container").width() - width - 10) ){
					left -= width;
				}

				$tooltip.css("left",left+"px");
				$tooltip.css("top",top+"px");
			}
		});

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
