// index.js

$(document).ready(function(){
	//initialize 

	setup_board();

	//set mousedown functions
	$(".space").mousedown(function(ev){
		if (ev.which == 3){
			toggle_mark($(this));
		}
	});
	//---------------------------
	$(".bomb").click(function(){
		clicked_bomb($(this));
	});
	//---------------------------
	$(".regular").click(function(){
		clicked_normal($(this));
	});
});
const php_file = "php/main.php";
var bomb_array = [];
var normal_count = 0;
var found = 0;
//--------------------------------------------------
function setup_board(){
	// var board = $("#board");
	var tile;
	var num;
	var cols = 9;
	var rows = 4;
	var size = cols * rows;

	for (var iter = 0; iter < size; iter++){
		if (iter % cols == 0){
			if (iter > 1){
				bomb_array.push(subarray);
			}
			var subarray = [];
		}
		num = Math.floor(Math.random() * 100);
		if (num>75){
			subarray.push(true);
			tile = "<div class='space bomb' id='" + iter + "'><p class='hidden' id='" + iter + "'></p></div>";
		} else {
			normal_count++;
			subarray.push(false);
			tile = "<div class='space regular' id='" + iter + "'><p class='hidden " + iter + "' id='" + iter + "'></p></div>";
		}
		$("#board").append(tile);
	}
	
	get_vals(cols, rows);
}

function get_vals(cols, rows){
	//send ajax call to php to get counts for the board
	sendAjax({
		functionname: 'set_vals',
		arguments: [rows, cols],
		bool_array: bomb_array
	})
	.done(function(response){
		set_vals(cols, rows, response);
	});
}

function set_vals(cols, rows, response){
	//uses data from ajax call to modify the table
	var array = response.numarr;
	var i, j, strid, elem;
	var getclass = 0;
	for (i = 0; i < rows; i++){
		for (j = 0; j < cols; j++){
			strid = 'p.'+getclass;
			elem = array[i][j];
			$(strid).text(elem);
			getclass++;
		}
	}
}

function reset_all(){
	$(".bomb").detach();
	$(".regular").detach();
	if ($("#deleteme")){
		$("#deleteme").detach();
	}
	if (!$("#victory").is(":empty")){
		$("#victory").text("");
	}
	$("#score").text("0");
	bomb_array = [];
	normal_count = 0;
	found = 0;
	setup_board();

	//reset all onclick funcs
	$(".space").mousedown(function(ev){
		if (ev.which == 3){
			toggle_mark($(this));
		}
	});
	//---------------------------
	$(".bomb").click(function(){
		clicked_bomb($(this));
	});
	//---------------------------
	$(".regular").click(function(){
		clicked_normal($(this));
	});
}

function entername(){
	if($("#playername")){
		var name = $("#playername").val();
		$("#playernameout").text(name);
		$("#playernameout").removeClass('hidden');
	}
}

function tutorial(){
	if ($("#instructout").is(':empty')){
		var str = "Welcome to MineSweeper! You can left click on the boxes to see what's underneath! If it's not a bomb, then it will display the number of neighboring bombs. If it IS a bomb, you lose. You can right click a box to mark it, if you suspect it may be a bomb. Lastly, hit the reset button to start over or play again. Have fun!!";
		$("#instructout").text(str)
	} else {
		var str = "";
		$("#instructout").text(str)
	}
}

//General Utility --------------------------------

function clicked_normal(elem){
	if (elem.children().hasClass("hidden")){
		elem.children().removeClass("hidden");
		elem.removeClass("space");
		elem.addClass("beenselec");
		increment_score();
		found++;
		if (found == normal_count){
			youWin();
		}
	}
}

function clicked_bomb(elem){
	elem.addClass("blown");
	elem.removeClass("space");
	sendAjax({url: php_file, functionname: "trigger_nuke"})
	.done(function(response){
		var eltoadd = response.element;
		$("body").append(eltoadd);
	});
}

function youWin(){
	if ($("#victory").is(':empty')){
		var str = "Congratulations, You Won!!";
		$("#victory").text(str)
	} else {
		var str = "";
		$("#victory").text(str)
	}
}

function sendAjax(args){ //args should be a dict ready for jsonification
	return $.ajax({
		type: "post",
		url: php_file,
		dataType: 'JSON',
		data: args,
		async: true
	});
}

function increment_score(){
	var current_score = Number($('#score').text());
	$("#score").text(current_score + 10);
}

function toggle_mark(elem){
	if (!elem.hasClass("marked") && !elem.hasClass("beenselec")){
		elem.addClass("marked");
		elem.text("Marked");
	} else {
		elem.removeClass("marked");
		elem.text("");
	}
}