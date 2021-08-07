$().ready(function(){
	attempt_addr_load();
	generate_receipt();
	$("#confirm").click(confirm_order);
});

function generate_receipt(){
	var possNames = ["LP", "SP", "LG", "SG", "LC", "SC", "LH", "SH", "LM", "SM", "LD", "SD"];
	var nameKeys = ["Large Pepperoni", "Small Pepperoni", "Large Glitter", "Small Glitter", "Large Cheese", "Small Cheese", "Large Hawaiian", "Small Hawaiian", "Large Meatlovers", "Small Meatlovers", "Large Dessert", "Small Dessert"];
	var assocPrice = [14.99, 9.99, 16.99, 11.99, 12.99, 7.99, 14.99, 9.99, 15.99, 10.99, 9.99, 4.99];
	var i;
	var cokie, html;
	var tprice = 0;
	for (i=0; i < possNames.length; i++){
		cokie = getCookie(possNames[i]);
		if (cokie != ""){
			count = cokie * 1;
			tprice = tprice + count * assocPrice[i];
			html = "<div class='item'><h4><u>"+nameKeys[i]+"</u>:</h4><p>Quantity: "+count+"</p><p>Price of Each: "+assocPrice[i]+"</p>";
			$(".list-order").append(html);
		}
	}
	html = "<span id='total-price'>Your Total is: <span id='price'>$"+tprice+"</span></span>";
	$(".list-order").append(html);
}

function clear_cart(){
	var allPNames = ["LP", "SP", "LG", "SG", "LC", "SC", "LH", "SH", "LM", "SM", "LD", "SD"];
	var i;
	for (i=0; i < allPNames.length; i++){
		deleteCookie(allPNames[i]);
	}
}

function confirm_order(){
	//save address in cookie
	if (cart_count() == 0){
		Swal.fire({
			title: "Error",
			text: "Your cart is empty...",
			icon: "error",
			button: "Okay"
		});
		return -1;
	}

	if ($("#addr").val() == ""){
		Swal.fire({
			title: "Error",
			text: "Please enter an address...",
			icon: "error",
			button: "Okay"
		});
		return -1;
	} else {
		setCookie("address", $("#addr").val());
	}
	if ($("#fname").val() == ""){
		Swal.fire({
			title: "Error",
			text: "Please enter your first name...",
			icon: "error",
			button: "Okay"
		});
		return -1;
	} else {
		setCookie("firstname", $("#fname").val());
	}
	if ($("#lname").val() == ""){
		Swal.fire({
			title: "Error",
			text: "Please enter your last name...",
			icon: "error",
			button: "Okay"
		});
		return -1;
	} else {
		setCookie("lastname", $("#lname").val());
	}
	//create popup
	Swal.fire({
		title: "Congrats!",
		text: "Your order has been received and is on its way!",
		icon: "success",
		button: "Yayy!!"
	});
	//clear order
	clear_cart();
	$(".list-order").children().remove();
	var html = "<h3 style='color: crimson;'>ORDER SUCCESSFULLY COMPLETED</h3>"
	$(".list-order").append(html);
}

function attempt_addr_load(){
	var fetch = getCookie("address");
	if (fetch != ""){
		$("#addr").val(fetch);
	}
	fetch = getCookie("firstname");
	if (fetch != ""){
		$("#fname").val(fetch);
	}
	fetch = getCookie("lastname");
	if (fetch != ""){
		$("#lname").val(fetch);
	}
}

function cart_count(){
	var allPNames = ["LP", "SP", "LG", "SG", "LC", "SC", "LH", "SH", "LM", "SM"];
	var i;
	var count = 0;
	var cokie;
	for (i=0; i < allPNames.length; i++){
		cokie = getCookie(allPNames[i]);
		if (cokie != ""){
			count = count + cokie * 1;
		}
	}
	return count;
}
// // Cookie Functions
// function setCookie(name, value){
// 	var numDays = 365;
// 	var date = new Date();
//     // getTime() gets today's date in milliseconds as of 01/01/1970
//     date.setTime (date.getTime() + (1000 * 60 * 60 * 24 * numDays));
//     //                              milli  sec  min  hr   days
//     // converted to total milliseconds to add to today
//     var expires = "expires=" + date.toUTCString();
// 	document.cookie = name + "=" + value + ";" + expires + ";path=/";
// 	console.log("Cookie set with params " + name + ", " + value);
// }

// function getCookie(input){
// 	var searchName = input + "=";
// 	var decodedCookie = decodeURIComponent (document.cookie);
//     var carray = decodedCookie.split(';');              
                                                
//     var i, oneCookie
//     for (i = 0; i < carray.length; i++) {
//         oneCookie = carray[i];                  
//         while (oneCookie.charAt(0) == ' ') {
//             oneCookie = oneCookie.substring(1);
//         }
//         if (oneCookie.indexOf(searchName) == 0) {
// 			console.log("Cookie gotten");
//             return oneCookie.substring(searchName.length, oneCookie.length);
//         }
// 	}
// 	console.log("Empty Cookie gotten");
//     return ""; 
// }

// function deleteCookie(name){
// 	document.cookie = name + "=; expires=; path=/";
// 	console.log("Cookie with name " + name + "deleted");
// }