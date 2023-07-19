// Color palette
let root = document.querySelector(':root');
let rootHue = Math.floor(Math.random()*360);
root.style.setProperty("--primary", `hsl(${rootHue},100%,50%)`);
root.style.setProperty("--complement", `hsl(${rootHue-180},100%,50%)`);
root.style.setProperty("--dark", `hsl(${rootHue},100%,25%)`);
root.style.setProperty("--light", `hsl(${rootHue},25%,75%)`);

let body = document.querySelector("body");
let pageColor = document.querySelector("#pageColor");
let toggleBackground = document.querySelector("#toggleBackground");
pageColor.value = rootHue;
function updateColor() {
	if (toggleBackground.checked) {
		body.style.backgroundColor = "white";
	} else {
		body.style.backgroundColor = "var(--dark)";
	}
	pageColor.nextElementSibling.value = rootHue;
	rootHue = pageColor.value;
	root.style.setProperty("--primary", `hsl(${rootHue},100%,50%)`);
	root.style.setProperty("--complement", `hsl(${rootHue-180},100%,50%)`);
	root.style.setProperty("--dark", `hsl(${rootHue},100%,25%)`);
	root.style.setProperty("--light", `hsl(${rootHue},25%,75%)`);
}

// Intro
let intro = document.querySelector(".intro");
let introSpans = document.querySelectorAll("h1 span");
for (i=0; i<introSpans.length; i++) {
	introSpans[i].style.animationDuration = Math.random()*5000+1500 + "ms";
	introSpans[i].style.setProperty("--stretch", Math.random()*5+1.5);
}

let introLoop = setInterval(() => {
	pageColor.value = parseInt(pageColor.value) + 1;
	updateColor();
	if (pageColor.value >= 359) {
		pageColor.value = 0;
	}
}, 200)

// Initialize animated grid variables
let grid = document.querySelector(".container");
let gridChildren = [];
let gridAnim;
let rows = [];
let cols = [];

// Get all menu settings
let customSource = document.getElementById("customSource");
let dropdownSource = document.getElementById("source");
let toggleAngle = document.getElementById("toggleAngle");
let sliderAngle = document.getElementById("numberAngle");
let toggleScale = document.getElementById("toggleScale");
let sliderScale = document.getElementById("numberScale");
let sliderCols = document.getElementById("numberCols");
let sliderRows = document.getElementById("numberRows");
let sliderZoom = document.getElementById("imageZoom");
let sliderShift = document.getElementById("imageShift");
let sliderTime = document.getElementById("loopTime");

// Default values for menu settings
dropdownSource.selectedIndex = Math.floor(Math.random()*dropdownSource.options.length);
let imageSource, numberImages, randomAngle, numberAngle, randomScale, numberScale, numberCols, numberRows, imageZoom, imageShift, looptime;

// Floating buttons init
let pause = false;
let screenshotBtn = document.querySelector("#screenshot");
let pauseBtn = document.querySelector("#pause");

function initialize() {
	clearInterval(introLoop);
	pause = false;
	pauseBtn.innerText = "⏸︎";
	screenshotBtn.classList.remove("btn-hide");
	pauseBtn.classList.remove("btn-hide");
	intro.classList.add("intro-hide");
	clearInterval(gridAnim);
	grid.innerHTML = "";
	imageSource = dropdownSource.value;
	randomAngle = toggleAngle.checked;
	numberAngle = sliderAngle.value;
	randomScale = toggleScale.checked;
	numberScale = sliderScale.value;
	numberCols = sliderCols.value;
	numberRows = sliderRows.value;
	imageZoom = sliderZoom.value;
	imageShift = sliderShift.value;
	loopTime = sliderTime.value;

	setGrid();

	let gridTemp = "";

	let color1 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
	let color2 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
	console.log(dropdownSource.value);

	for (i=0; i<numberCols*numberRows; i++) {
		let size = Math.random() * imageZoom + 1;
		let angle;
		if (randomAngle) {
			angle = Math.random() * numberAngle;
		} else {
			angle = numberAngle;
		}
		let scale;
		if (randomScale) {
			scale = (Math.random() * parseInt(numberScale) + 100)/100;
		} else {
			scale = (parseInt(numberScale) + 100)/100;
		}
		let posX = Math.random() * imageShift;
		let posY = Math.random() * imageShift;

		if (imageSource == "grad2" || imageSource == "grad4") {
			color1 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
			color2 = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
		}

		if (
			dropdownSource.options[dropdownSource.selectedIndex].text == "custom") {
			gridTemp += `<div style='background-image:url("${imageSource}");background-size:${size}%;background-position:${posX}% ${posY}%;transition:${loopTime}ms;transform:rotate(${numberAngle}deg);'></div>`
		} else if (imageSource == "grad1" || imageSource == "grad2") {
			gridTemp += `<div style='background-size:${size}%;background-position:${posX}% ${posY}%;transition:${loopTime}ms;background-image:linear-gradient(${Math.floor(Math.random()*360)}deg, ${color1} 0%, ${color2} 100%);transform:rotate(${angle}deg);'></div>`
		} else if (imageSource == "grad3" || imageSource == "grad4") {
			gridTemp += `<div style='background-size:${size}%;background-position:${posX}% ${posY}%;transition:${loopTime}ms;background-image:radial-gradient(circle, ${color1} 0%, ${color2} 100%);transform:rotate(${angle}deg);'></div>`
		} else if (imageSource == "random") {
			gridTemp += `<div style='background-image:url("assets/imgs/random/img${Math.floor(Math.random()*146)}.jpg");background-size:${size}%;background-position:${posX}% ${posY}%;transition:${loopTime}ms;transform:rotate(${angle}deg);'></div>`
		} else {
			gridTemp += `<div style='background-image:url("assets/imgs/${imageSource}");background-size:${size}%;background-position:${posX}% ${posY}%;transition:${loopTime}ms;transform:rotate(${angle}deg) scale(${scale});'></div>`
		}
	}
	grid.innerHTML = gridTemp;

	gridChildren = document.querySelectorAll(".container div");

	grid.style.transition = `grid-template-columns ${loopTime}ms, grid-template-rows ${loopTime}ms`;

	gridAnim = setInterval(gridAnimLoop, loopTime);
}

function gridAnimLoop() {
	if (pause == false) {
		for (var i = 0; i < gridChildren.length; i++) {
			let size = Math.random() * imageZoom + 1;
			let angle;
			if (randomAngle) {
				angle = Math.random() * numberAngle;
			} else {
				angle = numberAngle;
			}
			let scale;
			if (randomScale) {
				scale = (Math.random() * parseInt(numberScale) + 100)/100;
			} else {
				scale = (parseInt(numberScale) + 100)/100;
			}
			let posX = Math.random() * imageShift;
			let posY = Math.random() * imageShift;
			gridChildren[i].style.backgroundSize = size + "%";
			gridChildren[i].style.backgroundPosition = `${posX}% ${posY}%`;
			gridChildren[i].style.transform = `rotate(${angle}deg) scale(${scale})`;
		}
		setGrid();
	}
}

function setGrid() {
	cols = [];
	rows = [];
	if (numberCols != 1) {
		for (i = 0; i < numberCols; i++) {
			cols.push(parseInt(Math.random() * 20) + "fr");
		}
	} else {
		cols = ["1fr"];
	}
	if (numberRows != 1) {
		for (i = 0; i < numberRows; i++) {
			rows.push(parseInt(Math.random() * 20) + "fr ");
		}
	} else {
		rows = ["1fr"];
	}
	grid.style.gridTemplateColumns = cols.join(" ");
	grid.style.gridTemplateRows = rows.join(" ");
}

function randomize() {
	dropdownSource.selectedIndex = Math.floor(Math.random()*dropdownSource.options.length);

	if (Math.random()<.5) {
		toggleAngle.checked = false;
	} else {
		toggleAngle.checked = true;
	}

	sliderAngle.value = Math.floor(Math.random()*359);
	sliderAngle.nextElementSibling.value = sliderAngle.value;

	if (Math.random()<.5) {
		toggleScale.checked = false;
	} else {
		toggleScale.checked = true;
	}

	sliderScale.value = Math.round(Math.random()*250);
	sliderScale.nextElementSibling.value = sliderScale.value;

	sliderCols.value = Math.floor(Math.random()*20+1);
	sliderCols.nextElementSibling.value = sliderCols.value;

	sliderRows.value = Math.floor(Math.random()*20+1);
	sliderRows.nextElementSibling.value = sliderRows.value;

	sliderZoom.value = Math.floor(Math.random()*5000+1);
	sliderZoom.nextElementSibling.value = sliderZoom.value;

	sliderShift.value = Math.floor(Math.random()*300);
	sliderShift.nextElementSibling.value = sliderShift.value;

	sliderTime.value = Math.floor(Math.random()*4900+100);
	sliderTime.nextElementSibling.value = sliderTime.value;

	pageColor.value = Math.floor(Math.random()*360);
	updateColor();
}

function pauseGrid() {
	if (pause == false) {
		pause = true;
		pauseBtn.innerText = "▶️";
	} else {
		pause = false;
		pauseBtn.innerText = "⏸︎";
	}
}

// Read user-inputted image
if (window.FileList && window.File && window.FileReader) {
	document.getElementById('customSource').addEventListener('change', event => {
		const file = event.target.files[0];
		if (!file.type) {
			window.alert('That’s not an OK file type!');
			return;
		}
		if (!file.type.match('image.*')) {
			window.alert('That’s not an image!');
			return;
		}
		let userImg = URL.createObjectURL(file);
		
		if (dropdownSource.options[0].text != "custom") {
			let temp = document.createElement('option');
			temp.text = "custom";
			temp.value = userImg;
			console.log("hi!");
			dropdownSource.options.add(temp, 0);
		} else {
			dropdownSource.options.remove(0);
			let temp = document.createElement('option');
			temp.text = "custom";
			temp.value = userImg;
			console.log("hi!");
			dropdownSource.options.add(temp, 0);
		}
		dropdownSource.selectedIndex = 0;
		initialize();
	}); 
}

// Screenshot mode
let controls = document.querySelector("#controls");
let notice = document.querySelector("#notice");
let screenshotMode = false;
function screenshot() {
	controls.classList.add("controls-hide");
	screenshotBtn.classList.add("btn-hide");
	pauseBtn.classList.add("btn-hide");
	notice.style.opacity = "1";
	notice.style.filter = "blur(0)";
	setTimeout(function() {
		window.addEventListener('click', screenshotOut)
		notice.style.opacity = "0";
		notice.style.filter = "blur(100px)";
		screenshotMode = true;
	}, 3000);
}
function screenshotOut() {
	controls.classList.remove("controls-hide");
	screenshotBtn.classList.remove("btn-hide");
	pauseBtn.classList.remove("btn-hide");
	screenshotMode = false;
}

document.body.onkeyup = function(e) {
	if (e.key == " " ||
		e.code == "Space" ||      
		e.keyCode == 32
	) {
		if (screenshotMode) {
			screenshotMode = false;
			controls.classList.remove("controls-hide");
			screenshotBtn.classList.remove("btn-hide");
			pauseBtn.classList.remove("btn-hide");
		}
	}
  }