/*
* Common display and math functions used across the site
*/

// Round a float to a certain number of digits

function displayFloat(number, digits){
	if(digits == 0){
		return Math.round(number);
	}

	number = number * (10 * digits);
	number = Math.round(number);
	number /= (10 * digits);

	return number;
}

// Return a message from the message object

function msg(stringId, dynamicStrings){
	dynamicStrings = typeof dynamicStrings !== 'undefined' ? dynamicStrings : [];

	let message = stringId;

	if(messages[stringId]){
		message = messages[stringId];

		// Replace dynamic portions from array of provided strings
		for(var i = 0; i < dynamicStrings.length; i++){
			message = message.replace("%"+(i+1)+"$s", dynamicStrings[i]);
		}
	} else{
		console.error(stringId + " not found");
	}

	return message;
}

// Returns an element containing a selectable Pokemon tile from the provided build or dataset

function createPokemonSquare(poke, context){
	let $pokeEl = $(".pokemon.template").first().clone().removeClass("template");

	$pokeEl.find(".name").html(msg(poke.pokemonId));
	$pokeEl.find(".image-container").attr("role", poke.role);
	$pokeEl.find(".image").css("background-image", "url("+getAsset(poke.pokemonId, "pokemon", "png")+")");
	$pokeEl.attr("pokemon-id", poke.pokemonId);

	// Show X button for favorites and team squares
	if((context == "favorites")||(context == "teams")){
		$pokeEl.find("a.remove").css("display","flex");
	}

	// Show held items for favorites squares
	if((context == "favorites") || (context == "teams")){
		for(var i = 0; i < poke.heldItems.length; i++){
			let $item = $("<div class=\"item\"></div>");
			$item.css("background-image", "url("+getAsset(poke.heldItems[i].assetId, "helditems", "png")+")");
			$pokeEl.find(".items").append($item);
		}
	}

	return $pokeEl;
}

// Return the URL of a provided Pokemon or item asset

function getAsset(name, dir, ext){
	return host + "img/" + dir + "/" + name + "." + ext + "?v=" + siteVersion;
}

// Global interaction scripts

$(".hamburger").click(function(e){
	$("header .menu").slideToggle(125);
});

// Submenu interaction on desktop
if($(window).width() > 768){

	$("body").on("click", function(e){
		if(e.type == "click"){
			if($(".submenu:hover, .parent-menu:hover").length == 0){
				$(".submenu").removeClass("active");
			} else{
				e.preventDefault();
				$(e.target).closest(".parent-menu").find(".submenu").toggleClass("active");
			}
		}
	});

	$("body").on("mousemove click", function(e){
		if($("header .submenu:hover, header .parent-menu:hover").length == 0){
			$("header .submenu").removeClass("active");
		}
	});

	$("body").on("mouseover", "header .menu .parent-menu", function(e){
		e.preventDefault();
		$(".submenu").removeClass("active");
		$(this).find(".submenu").addClass("active");
	});
} else{
	$("body").on("click", ".build-select .menu .parent-menu", function(e){
		e.preventDefault();
		$(this).find(".submenu").toggleClass("active");
	});

	$("body").on("click", function(e){
		if($(".build-select .submenu:hover, .build-select .parent-menu:hover").length == 0){
			$(".build-select .submenu").removeClass("active");
		}
	});
}


// Toggle buttons on and off

$("body").on("click", "button.toggle", function(e){
	$(e.target).toggleClass("on");
});

// Auto select link

$("body").on("click", ".share-link input", function(e){
	this.setSelectionRange(0, this.value.length);
});

// Link share copying

$("body").on("click", ".share-link .copy", function(e){
	var el = $(e.target).prev()[0];
	el.focus();
	el.setSelectionRange(0, el.value.length);
	document.execCommand("copy");
});

// Toggleable sections

$("body").on("click", ".toggle", function(e){
	e.preventDefault();

	$(e.target).closest(".toggle").toggleClass("active");
});

// Tab navigation

$("body").on("click", ".tabs a", function(e){
	e.preventDefault();

	$(e.target).closest(".tabs").find("a").removeClass("active");
	$(this).addClass("active");
});

// Checkboxes

$("body").on("click", ".check", function(e){
	e.preventDefault();

	$(e.target).closest(".check").toggleClass("on");
});

// Service worker handler
if ('serviceWorker' in navigator) {
	console.log("Attempting to register service worker");
	navigator.serviceWorker.register('service-worker.js')
	  .then(function(reg){
		console.log("Service worker registered.");
	  }).catch(function(err) {
		console.log("Service worker failed to register:", err)
	  });
}
