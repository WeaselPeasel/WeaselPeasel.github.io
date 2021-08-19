const header = document.getElementById("header");
'<a id="logo" href="index.html"><img src="images/Logo2.png"></a>'
let img1 = document.createElement("img");
img1.src = "images/Logo2.png";
img1.id += "logo";
let img2 = document.createElement("img");
img2.src = "images/Banner.png";
img2.id = "banner";
let img3 = document.createElement("img");
img3.src = "images/selfie.jpg";
img3.id = "headshot";

if (window.matchMedia('(max-device-width: 800px)').matches){
    // render on two lines
    header.appendChild(img2);
    header.appendChild(img1);
    header.appendChild(img3);
    console.log("Device too small");
} else {
    // render normally
    header.appendChild(img1);
    header.appendChild(img2);
    header.appendChild(img3);
    console.log("Device large enough");
}