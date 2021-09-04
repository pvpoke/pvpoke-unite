
<?php require 'modules/ads/nitro-sidebar-left.php'; ?>
<?php require 'modules/ads/nitro-sidebar-right.php'; ?>
<?php require 'modules/ads/mobile-320.php'; ?>

<footer>
	<p class="copyright">Version <a href="https://github.com/pvpoke/pvpoke-unite/"><?php echo $SITE_VERSION; ?></a> &copy; 2021 PvPoke LLC, released under the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT license</a> | <a href="<?php echo $WEB_ROOT;?>privacy/">Privacy Policy</a></p>
	<p><?php e("disclaimer"); ?></p>
</footer>

<!--Global script-->
<script>
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

</script>
</body>
</html>
