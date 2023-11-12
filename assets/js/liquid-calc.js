// walls
let valueOfWalls = document.getElementsByName("value-of-walls")[0];
let hWall = document.getElementsByName("hWalls")[0];
let wWall = document.getElementsByName("wWalls")[0];
// windows
let valueOfWindows = document.getElementsByName("value-of-windows")[0];
let hWindow = document.getElementsByName("hWindows")[0];
let wWindow = document.getElementsByName("wWindows")[0];
// doors
let valueOfDoors = document.getElementsByName("value-of-doors")[0];
let hDoor = document.getElementsByName("hDoors")[0];
let wDoor = document.getElementsByName("wDoors")[0];
// pack
let kiloInPack = document.getElementsByName("kilo-in-pack")[0];
let layers = document.getElementsByName("layers")[0];
let expence = document.getElementsByName("expence")[0];
// total
let packs = document.getElementById("packs");
let kilo = document.getElementById("kilo");

let form = document.getElementById("form");
let total = document.getElementById("total");
let warn = document.getElementById("warn");
let loading = document.getElementById("loading");
addListeners();

let walls = document.getElementById("walls");
let walls_perfs = document.getElementById("walls-perfs");

let errorIsShowing;
let loadingIsShowing;
let kiloValue;
let packsValue;


function setWallBtn(count) {
    let wallSample = walls.firstChild.cloneNode(true);
    while (walls.hasChildNodes()) {
        walls.removeChild(walls.lastChild);
    }
    walls.appendChild(wallSample);
    for (let index = 1; index < count; index++) {
        addWallBtn();
    }
}

function addWallBtn() {
    let newWall = walls.lastChild.cloneNode(true);
    newWall.textContent = +newWall.textContent + 1;
    walls.appendChild(newWall);
}

function clearPrefs() {
    let elementHWalls = walls_perfs.children[0].children[1];
    let elementWWalls = walls_perfs.children[1].children[1];
    elementHWalls.value = "";
    elementWWalls.value = "";
}

function displayError() {
    // console.log("Показываю ошибку");
    if (errorIsShowing) {
        return;
    }
    else if(loadingIsShowing){
        removeLoading();
    }
    errorIsShowing = true;
    warn.style = "display: flex;padding: 20px;";
    total.style = "padding: 10px; height: 100%; background-color: var(--bs-danger); filter: blur(5px); border-radius: 10px"
}

function removeError() {
    // console.log("Не показываю ошибку");
    if (!errorIsShowing) {
        return;
    }
    errorIsShowing = false;
    warn.style = "padding: 20px;";
    total.style = "padding: 10px; height: 100%; border-radius: 10px"
}

function displayLoading() {
    // console.log("Показываю загрузку");
    if (loadingIsShowing || errorIsShowing) {
        return;
    }
    loadingIsShowing = true;
    loading.style = "display: flex;";
    total.style = "padding: 10px; height: 100%; filter: blur(5px)"
}

function removeLoading(){
    // console.log("Не показываю загрузку");
    if (!loadingIsShowing) {
        return;
    }
    loadingIsShowing = false;
    loading.style = "";
    total.style = "padding: 10px; height: 100%;"
}

function addListeners(params) {
    let inputs = document.getElementsByTagName("input");
    for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        // element.addEventListener("oninput", recalc);
        element.oninput = recalcWithLoading;
    }
}

function calcS(value, h, w) {
    return value * (h/100) * (w/100)
}

function recalcWithLoading() {
    displayLoading();
    recalc();
    removeLoading();
}

function recalc() {
    if (!form.checkValidity()) {
        displayError();
        return;
    }
    sWalls = calcS(valueOfWalls.value, hWall.value, wWall.value);
    sDoors = calcS(valueOfDoors.value, hDoor.value, wDoor.value);
    sWindows = calcS(valueOfWindows.value, hWindow.value, wWindow.value);
    S = (sWalls - (sWindows + sDoors)) * layers.value;
    if (S < 0.1){
        displayError();
        console.warn("Площадь слишком мала");
        return;
    }
    console.log(`kiloInPack = ${kiloInPack.value}`);
    console.log(`sWalls = ${sWalls}, sWindows = ${sWindows}, sDoors = ${sDoors}, S = ${S}`);
    console.log(`kilo = ${kiloValue}, packs = ${packsValue}`);
    removeError();
    updateValues();
}

function updateValues() {
    if (kilo.firstChild || packs.firstChild){
        kilo.removeChild(kilo.firstChild);
        packs.removeChild(packs.firstChild);
    }
    kiloValue = (S / expence.value).toFixed(2);
    packsValue = Math.ceil(kiloValue / kiloInPack.value);
    if ((kiloValue > 0 && packsValue > 0) && (kiloValue != Infinity && packsValue != Infinity)){
        kilo.appendChild(document.createTextNode(kiloValue));
        packs.appendChild(document.createTextNode(packsValue));
    }
    else{
        displayError();
    }
}

recalc();