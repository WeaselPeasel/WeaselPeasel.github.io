// orderpage.js -- used only for orderpage2.html, as of right now
$(document).ready(function(){
	update_cart_count();
	$("button#atc").click(add_to_cart);
	$("#clr-order").click(clear_cart);
	$("#submit").click(function(){
		if ($(".cart-count").text() == "0"){
			Swal.fire({
				title: "Error",
				text: "Your Cart is empty...",
				icon: "error",
				button: "Okay"
			})
		} else{
		 	window.location.href = 'orderform.html';
		}
	});
});



function add_to_cart(){
	// var test = $(this).val();
	// console.log(test);
	var inp = $(this).val();
	var count = getCookie(inp);
	if(count == ""){
		console.log("here");
		count = 1;
		setCookie(inp, count);
	} else {
		console.log("cookie found");
		count = count * 1 + 1;
		setCookie(inp, count);
	}
	update_cart_count();
}

function update_cart_count(){
	var allPNames = ["LP", "SP", "LG", "SG", "LC", "SC", "LH", "SH", "LM", "SM", "LD", "SD"];
	var i;
	var count = 0;
	var cokie;
	for (i=0; i < allPNames.length; i++){
		cokie = getCookie(allPNames[i]);
		if (cokie != ""){
			count = count + cokie * 1;
		}
	}

	$(".cart-count").empty();
	$(".cart-count").text(count);
}

function clear_cart(){
	var allPNames = ["LP", "SP", "LG", "SG", "LC", "SC", "LH", "SH", "LM", "SM", "LD", "SD"];
	var i;
	for (i=0; i < allPNames.length; i++){
		deleteCookie(allPNames[i]);
	}
	update_cart_count();
	Swal.fire({
		title: "Success",
		text: "Your cart has been cleared",
		icon: "success",
		button: "Okay"
	});
}

