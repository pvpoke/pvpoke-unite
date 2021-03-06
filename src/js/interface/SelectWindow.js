/*
* Utilizes ModalWindow.js for selecting items or moves
*/

function SelectWindow($content, type, build, selectCallback, itemIndex, selectedItem){
	index = typeof index !== 'undefined' ? index : -1;
	selectedItem = typeof selectedItem !== 'undefined' ? selectedItem : null;

	// Set content header
	$content.attr("header", $content.attr("header-"+type));

	let self = this;
	let modal = new ModalWindow($content);
	let $form = $(".modal").last().find(".select-modal");
	let gm = GameMaster.getInstance();
	let idKey = "itemId";

	$form.attr("type", type);

	if(type == "move"){
		idKey = "moveId";
	}

	let imgDir = '';

	// Grab the directory for the image of this item
	if(type == "held"){
		imgDir = "helditems";
	} else if(type == "battle"){
		imgDir = "battleitems";
	} else if(type == "move"){
		imgDir = "moves";
	}

	// Populate item list
	let itemArray = [];

	if(type == "held"){
		itemArray = gm.heldItems;
	} else if(type == "battle"){
		itemArray = gm.battleItems;
	} else if(type == "move"){
		itemArray = build.movePool[itemIndex];

		if((itemIndex != "slot1") && (itemIndex != "slot2")){
			itemArray = [build.movePool[itemIndex]];
		}
	}

	for(var i = 0; i < itemArray.length; i++){
		let itemId = itemArray[i][idKey];
		let assetId = itemId;
		let color = "";

		if(type == "move"){
			color = itemArray[i].color;
			assetId = itemArray[i].assetId;
		}

		let $item = $form.find(".item.template").first().clone().removeClass("template");
		let displayId = itemId;

		if(displayId.indexOf("_basic") > -1){
			displayId = "basic_attack";
		}

		$item.find(".name").html(msg(displayId));
		$item.find(".image .asset").css("background-image", "url("+getAsset(assetId, imgDir, "png")+")");
		$item.attr("value", itemId);
		$item.attr("asset-id", assetId);
		$item.find(".image").attr("color", color);

		if(type == "held"){
			if(build.hasHeldItem(itemId)){
				if((selectedItem)&&(selectedItem.itemId != itemId)){
					$item.addClass("disabled");
				} else if(! selectedItem){
					$item.addClass("disabled");
				}
			}
		}

		$form.find(".item-list").append($item);
	}

	if(selectedItem){
		$form.find(".item[value=\""+selectedItem[idKey]+"\"]").addClass("selected");
		updateHeldItemDetails();

		// Set the stacks form to the currently selected amount
		if(selectedItem.stacks !== undefined){
			$form.find(".selected-description .stacks").val(selectedItem.stacks);
		}
	} else{
		$form.find(".item[value=\"none\"]").addClass("selected");
		updateHeldItemDetails();
	}

	// Hide the selection options if only 1 option
	if(itemArray.length <= 1){
		$form.find(".item-list").hide();
		$form.find("button.select").hide();
	}

	// Item click

	$form.find(".item-list .item").click(function(e){

		let $item = $(e.target).closest(".item");

		if($item.hasClass("disabled")){
			return false;
		}

		$form.find(".item-list .item").removeClass("selected");
		$item.addClass("selected");

		updateHeldItemDetails();
	});

	// Item selection

	$form.find("button.select").click(function(e){
		let itemId = $form.find(".item.selected").attr("value");

		let stacks = 1;

		if($form.find(".selected-description .stacks").length > 0){
			stacks = $form.find(".selected-description .stacks").val();
		}

		selectCallback(itemId, itemIndex, stacks);

		modal.close();
	});

	// In the modal window, update the selected held item's details

	function updateHeldItemDetails(){
		let $item = $form.find(".item.selected");
		let $selectedItem = $form.find(".selected-item");
		let selectedIndex = $form.find(".item").index($item) - 1; // -1 because of the template
		let $selectedDescription = $form.find(".selected-description");
		let itemId = $item.attr("value");
		let assetId = $item.attr("asset-id");
		let color = $item.find(".image").attr("color");
		let descriptionKey = $item.attr("value") + "_description";

		$selectedItem.find(".name").html($item.find(".name").html());
		$selectedItem.find(".image .asset").css("background-image", "url("+getAsset(assetId, imgDir, "png")+")");
		$selectedItem.find(".image").attr("color", color);

		if(type == "held"){
			let heldItem = new HeldItem(itemId);
			$selectedDescription.html(heldItem.descriptionHTML(build));
		} else{
			$selectedDescription.html(msg(descriptionKey));
		}

		// Display item attributes
		let $attributes = $selectedItem.find(".attributes");


		$attributes.html("");
		$attributes.hide();


		// Show move attributes and unlock details
		if(type == "move"){
			let move = itemArray[selectedIndex];

			if(move.cooldown){
				$attributes.append("<div class=\"cooldown\">"+displayFloat(move.cooldown, 1)+msg("cooldown_abbreviation")+"</div>");

				if(move.cooldown < move.baseCooldown){
					$attributes.find(".cooldown").addClass("boosted");
				}
			}

			if(move.category){
				$attributes.append("<div>"+msg(move.category)+"</div>");
			}

			if((move.style)&&(move.style != "other")){
				$attributes.append("<div>"+msg(move.style)+"</div>");
			}

			$attributes.show();

			// Add unlock and upgrade details

			let $secondary = $('<div class="boosts"></div>');

			if((itemIndex != "basic")&&(itemIndex != "passive")){
				$secondary.append('<div class="boost corners"><span>'+move.unlockLevel + '</span> ' + msg("unlock_level") + '</div>');
			}

			if((itemIndex == "slot1")||(itemIndex == "slot2")){
				if(move.upgradeLevel){
					$secondary.append('<div class="boost corners"><span>'+move.upgradeLevel + '</span> ' + msg("upgrade_level") + '</div>');
					$selectedDescription.append('<div class="upgrade-description"><b>'+msg("upgrade")+":</b> "+msg(move.moveId+"_upgrade")+'</div>');
				}
			}

			$selectedDescription.append($secondary);


			// For moves, disable the select button if this is the first option
			if(selectedIndex == 0){
				$form.find("button.select").addClass("disabled");
			} else{
				$form.find("button.select").removeClass("disabled");
			}
		}

		// Show battle item attributes

		if(type == "battle"){
			let battleItem = new BattleItem(itemId);

			if(itemId != "none"){
				$attributes.append("<div class=\"cooldown\">"+displayFloat(battleItem.cooldown, 1)+msg("cooldown_abbreviation")+"</div>");
			}

			$attributes.show();
		}

		// For held items with variable stacks, show the stack form
		if(type == "held"){
			let heldItem = new HeldItem(itemId);

			if(heldItem.maxStacks > 1){
				let $stackForm = $form.find(".stacks-section.template").clone().removeClass("template");
				$selectedDescription.find(".boosts").prepend($stackForm);
			}
		}

		// Scroll description to top
		$selectedDescription.scrollTop(0);
	}
}
