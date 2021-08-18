/*
* Utilizes ModalWindow.js for selecting items or moves
*/

function SelectWindow($content, type, build, selectCallback, itemIndex, selectedItem){
	index = typeof index !== 'undefined' ? index : -1;
	selectedItem = typeof selectedItem !== 'undefined' ? selectedItem : null;

	let self = this;
	let modal = new ModalWindow($content);
	let $form = $(".modal .select-modal");
	let gm = GameMaster.getInstance();
	let idKey = "itemId";

	if(type == "move"){
		idKey = "moveId";
	}

	// Populate item list
	let itemArray = [];

	if(type == "held"){
		itemArray = gm.heldItems;
	} else if(type == "battle"){
		itemArray = gm.battleItems;
	} else if(type == "move"){
		itemArray = build.movePool[itemIndex];

		if((itemIndex != "slot1") &&(itemIndex != "slot2")){
			itemArray = [build.movePool[itemIndex]];
		}
	}

	for(var i = 0; i < itemArray.length; i++){
		let itemId = itemArray[i][idKey];

		let $item = $form.find(".item.template").clone().removeClass("template");
		let displayId = itemId;

		if(displayId.indexOf("_basic") > -1){
			displayId = "basic_attack";
		}

		$item.find(".name").html(msg(displayId));
		$item.attr("value", itemId);

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

		selectCallback(itemId, itemIndex);

		modal.close();
	});

	// In the modal window, update the selected held item's details

	function updateHeldItemDetails(){
		let $item = $form.find(".item.selected");
		let $selectedItem = $form.find(".selected-item");
		let $selecteDescription = $form.find(".selected-description");

		$selectedItem.find(".name").html($item.find(".name").html())
		$selecteDescription.html(msg($item.attr("value") + "_description"));
	}
}
