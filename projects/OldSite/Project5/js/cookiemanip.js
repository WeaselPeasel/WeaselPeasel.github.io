// Cookie Functions
function setCookie(name, value){
	var numDays = 365;
	var date = new Date();
    // getTime() gets today's date in milliseconds as of 01/01/1970
    date.setTime (date.getTime() + (1000 * 60 * 60 * 24 * numDays));
    //                              milli  sec  min  hr   days
    // converted to total milliseconds to add to today
    var expires = "expires=" + date.toUTCString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
	console.log("Cookie set with params " + name + ", " + value);
}

function getCookie(input){
	var searchName = input + "=";
	var decodedCookie = decodeURIComponent (document.cookie);
    var carray = decodedCookie.split(';');              
                                                
    var i, oneCookie
    for (i = 0; i < carray.length; i++) {
        oneCookie = carray[i];                  
        while (oneCookie.charAt(0) == ' ') {
            oneCookie = oneCookie.substring(1);
        }
        if (oneCookie.indexOf(searchName) == 0) {
			console.log("Cookie gotten");
            return oneCookie.substring(searchName.length, oneCookie.length);
        }
	}
	console.log("Empty Cookie gotten");
    return ""; 
}

function deleteCookie(name){
	document.cookie = name + "=; expires=; path=/";
	console.log("Cookie with name " + name + "deleted");
}