

// funfotos.js
// Declare some constants
var SEARCH_BAR = "#searchText";
var DATE_START = "input[name='Start']";
var DATE_END = "input[name='End']";
var DRAW_BOARD = ".imageDiv";

$(document).ready(function(){
	
	$(".clearPage").click(function(){
		var page = $(".pagePicker").val();
		data = {function: "dropCurrentPage", page:page};
		sendAjax(data);
		$(".canvasMain").empty();
		$(".canvasWrap").css("background", "");
	});
	
	$(".pagePicker").change(function(){
		loadPage($(this).val());
	});
	
	Swal.fire({
		title: "Fun Fotos",
		text: "Would you like to create or load a photobook?",
		icon: "question",
		showCancelButton: true,
		confirmButtonColor: "#3085dc",
		cancelButtonColor: "3085dc",
		confirmButtonText: "Create Photobook",
		cancelButtonText: "Load Photobook"
	})
	.then((result) => {
		if (!result.value) {
			loadPage();
		}
		else {
			var data = {function: "drop"};
			sendAjax(data);
		}
	});
	$("#Submit").click(fetch_images);

	// Andrew's Section
	//resets photobook
	$(".resetBook").click(function(){
		Swal.fire({
			title: "Are you sure?",
			text: "Once deleted, your book will be gone forever",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
		})
		.then((willDelete) => {
			if (willDelete.value) {
				Swal.fire({
					title: "Your photo book has been reset!",
					icon: "success",
				});
				// Remove images from div
				$(".canvasMain").empty();
				$(".canvasWrap").css("background", "");
			  	var data = {function: "drop"};
			  	sendAjax(data);
			}
		});
	});

	//changes canvas background color
    $("#colorP").change(function(){
        var color = document.getElementById("colorP").value;
        $(".canvasWrap").css("background", color);
		var page = $(".pagePicker").val();
		var data = {function: "storebgcolor", bgcolor: color, page: page};
		sendAjax(data);
    });
});

function fetch_images(){
	// grab all images based on search and date parameters. date parameters must be set
	var data = {searchquery: null, date1: null, date2: null, function: "fetch_images"};
	if ($(SEARCH_BAR).val()){
		data['searchquery'] = $(SEARCH_BAR).val();
	} if ($(DATE_START).val() && $(DATE_END).val()){
		data['date1'] = $(DATE_START).val();
		data['date2'] = $(DATE_END).val();
	}
	$(".imgDisp").detach();
	sendAjax(data).done(function(response){
		if (response.error){
			//alert(response.error);
		}
		display_images_bar(response);
	});
}

function display_images_bar(response){
	var thearray = response.img;
	var i;
	for (i = 0; i < thearray.length; i++){
		drawImage(thearray[i]);
	}
	// Give Images onclick
	$(".imgDisp").click(transferPhoto);
	
    function transferPhoto (){
		var numItems = $('.imgFinal').length;
		if (numItems != 3){
			var value = $(this).attr('value');
			var page = $(".pagePicker").val();
			var data = {function: "getimagebyid", imgID: value, page:page};
			sendAjax(data).done(function(response){
				$(".canvasMain").append(response.url);
			});	
		}
    }
    
}

// Utility functions
function drawImage(arg){
	$(".imgDiv").append(arg);
}

function sendAjax(args){
	return $.ajax({
		type: "post",
		url: "php/funfotos.php",
		dataType: "JSON",
		data: args
	});
}

function loadPage() {
	$(".canvasMain").empty();
	$(".canvasWrap").css("background", "");
	var page = $(".pagePicker").val();
	var data = {function: "loadCurrentPage", page: page};
	sendAjax(data).done(function (response){
		$(".canvasWrap").css("background", response.bgcolor);
		$(".canvasMain").append(response.a0);
		$(".canvasMain").append(response.a1);
		$(".canvasMain").append(response.a2);
	});	
}

