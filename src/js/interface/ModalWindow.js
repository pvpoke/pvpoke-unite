// JavaScript Document

var closePrevention = false; // Prevents closing the window during certain interactions

function ModalWindow(content, manualHeader){
	let self = this;
	let $content = $(content).clone();
	$content.removeClass("hide");
	let header = $content.attr("header");

	if(manualHeader){
		header = manualHeader
	}

	let $modal = $("<div class=\"modal\"><div class=\"modal-container\"><div class=\"modal-header\"></div><div class=\"modal-close\"></div><div class=\"modal-content\"></div></div></div>");


	$modal.find(".modal-header").html(header);
	$modal.find(".modal-content").append($content);

	this.close = function(){
		$modal.remove();

		self = null;
	}

	$("body").append($modal);

	// Close the window on clicking the X or clicking outside the window

	$(".modal-close").click(function(e){
		self.close();
	});

	// Decline confirmation

	$(".modal .no").click(function(e){
		self.close();
	});


	$(".modal").click(function(e){

		if($(".modal-container:hover, option:hover, input:focus").length == 0){
			self.close();
		}
	});
}

function setModalClosePrevention(time){
	closePrevention = true;

	setTimeout(function(){
		closePrevention = false;
	}, time);
}

function closeModalWindow(){
	if(! closePrevention){
		$(".modal").remove();
	}
}
