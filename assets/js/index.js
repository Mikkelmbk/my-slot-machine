let rulle1Overflowing = document.querySelector('.rulle1-overflowing');
let rulle2Overflowing = document.querySelector('.rulle2-overflowing');
let rulle3Overflowing = document.querySelector('.rulle3-overflowing');
let gevinstDisplayElement = document.querySelector('.gevinst-ul');
let startBtnElement = document.querySelector('.start-btn');
let autoBtnElement = document.querySelector('.auto-btn');
let betalMønterBtnElement = document.querySelector('.betal-mønter');
let møntIndkast = document.querySelector('.mønt-indkast');
let rulle1Displayed = document.querySelector('.rulle1');
let mønterElement = document.querySelector('.mønter');
let winRateDisplayElement = document.querySelector('.win-rate');
let spilResultat = document.querySelector('.spil-resultat');
let freeSpinsDisplayElement = document.querySelector('.free-spins');
let gameCountDisplayElement = document.querySelector('.game-count');
let audioElement = document.querySelector('audio');

let holdRulle1Btn = document.querySelector('.hold-rulle1');
holdRulle1Btn.disabled = true;
let holdRulle1Boolean = false;
let holdRulle2Btn = document.querySelector('.hold-rulle2');
holdRulle2Btn.disabled = true;
let holdRulle2Boolean = false;
let holdRulle3Btn = document.querySelector('.hold-rulle3');
holdRulle3Btn.disabled = true;
let holdRulle3Boolean = false;

let figurHøjde = Math.floor(rulle1Displayed.offsetHeight / 3);
let mønter = 200;
let allowSpin = 10;
let currentlySpinning = false;
let freeSpinCount = 0;
let arrayExtentions = 5;
let gameCount = 0;
let winCount = 0;
let autoSpinActive = false;
let autoSpinInterval;
updateCoinAndSpinCount();
winRateDisplayElement.innerHTML = "Win-rate: 0%";
gameCountDisplayElement.innerHTML = `T: 0 | L: 0 | W: 0`;


// let Data = [
// 	{
// 		"name": "appelsin",
// 		"rarity": 5,
// 		"file": "appelsin.png",
// 		"value": 50
// 	},
// 	{
// 		"name": "bar",
// 		"rarity": 3,
// 		"file": "bar.png",
// 		"value": 150
// 	},
// 	{
// 		"name": "7",
// 		"rarity": 2,
// 		"file": "syv.png",
// 		"value": 300
// 	},
// 	{
// 		"name": "blomme",
// 		"rarity": 4,
// 		"file": "blomme.png",
// 		"value": 80
// 	},
// 	{
// 		"name": "diamant",
// 		"rarity": 1,
// 		"file": "diamant.png",
// 		"value": 500
// 	},
// 	{
// 		"name": "melon",
// 		"rarity": 5,
// 		"file": "melon.png",
// 		"value": 50
// 	}
// ];
let Data = [
    {
        "name": "bar",
        "rarity": 4,
        "file": "bar.png",
        "value": 150
    },
    {
        "name": "7",
        "rarity": 2,
        "file": "syv.png",
        "value": 500
    },
    {
        "name": "blomme",
        "rarity": 6,
        "file": "blomme.png",
        "value": 80
    },
    {
        "name": "diamant",
        "rarity": 1,
        "file": "diamant.png",
        "value": 1000
    },
    {
        "name": "melon",
        "rarity": 7,
        "file": "melon.png",
        "value": 50
    }
];

let tempArray = [];

for (let i = 0; i < Data.length; i++) {
    for (let r = Data[i].rarity; r > 0; r--) {
        tempArray.push(Data[i]);
    }
}

let X = tempArray.length;
let rulle1Index;
let rulle2Index;
let rulle3Index;
let rulle1VenstreTop;
let rulle1VenstreCenter;
let rulle1VenstreBund;
let rulle2Center;
let rulle3HøjreTop;
let rulle3HøjreCenter;
let rulle3HøjreBund;


Data.sort((a, b) => (b.rarity > a.rarity) ? 1 : -1); // If b.rarity is bigger than a.rarity, return 1 to the sort function, else return -1
Data.forEach((figurObjekt) => {
    let gevinstDisplayFigurElement = document.createElement('li');
    gevinstDisplayElement.appendChild(gevinstDisplayFigurElement);
    let rarityDisplay = document.createElement('p');
    rarityDisplay.innerHTML = `Rarity: ${figurObjekt.rarity * arrayExtentions}`;
    gevinstDisplayFigurElement.appendChild(rarityDisplay);
    let figurBillede = document.createElement('img');
    figurBillede.src = `assets/image/${figurObjekt.file}`;
    gevinstDisplayFigurElement.appendChild(figurBillede);
    let figurVærdi = document.createElement('h3');
    figurVærdi.innerHTML = `Value: ${figurObjekt.value}`;
    gevinstDisplayFigurElement.append(figurVærdi);
});

let rullerArray = [[], [], []];

shuffle(tempArray);
function shuffle(A) {
    var currentIndex = A.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = A[currentIndex];
        A[currentIndex] = A[randomIndex];
        A[randomIndex] = temporaryValue;
    }
    return A;
}

for (let i = 0; i < arrayExtentions; i++) {
    tempArray.forEach((tempObject) => {
        rullerArray[0].push(tempObject);
    });
}

for (let i = 0; i < arrayExtentions; i++) {
    tempArray.forEach((tempObject) => {
        rullerArray[1].push(tempObject);
    });
}

for (let i = 0; i < arrayExtentions; i++) {
    tempArray.forEach((tempObject) => {
        rullerArray[2].push(tempObject);
    });
}

makeRulle1();
function makeRulle1() {
    rulle1Overflowing.style.transition = "unset";
    rulle1Overflowing.innerHTML = "";
    rulle1Overflowing.style.marginTop = "0";
    rullerArray[0].forEach((rulle1) => {
        let rulleFigur = document.createElement('img');
        rulleFigur.style.height = `${figurHøjde}px`;
        rulleFigur.src = `assets/image/${rulle1.file}`;
        rulleFigur.classList.add('rulle-figur');
        rulle1Overflowing.appendChild(rulleFigur);
    });


}

makeRulle2();
function makeRulle2() {
    rulle2Overflowing.style.transition = "unset";
    rulle2Overflowing.innerHTML = "";
    rulle2Overflowing.style.marginTop = "0";
    rullerArray[1].forEach((rulle2) => {
        let rulleFigur = document.createElement('img');
        rulleFigur.style.height = `${figurHøjde}px`;
        rulleFigur.src = `assets/image/${rulle2.file}`;
        rulleFigur.classList.add('rulle-figur');
        rulle2Overflowing.appendChild(rulleFigur);
    });
}

makeRulle3();
function makeRulle3() {
    rulle3Overflowing.style.transition = "unset";
    rulle3Overflowing.innerHTML = "";
    rulle3Overflowing.style.marginTop = "0";
    rullerArray[2].forEach((rulle3) => {
        let rulleFigur = document.createElement('img');
        rulleFigur.style.height = `${figurHøjde}px`;
        rulleFigur.src = `assets/image/${rulle3.file}`;
        rulleFigur.classList.add('rulle-figur');
        rulle3Overflowing.appendChild(rulleFigur);
    });
}

betalMønterBtnElement.addEventListener('click', () => {
    depositCoins();
});

function depositCoins() {
    if (!isNaN(parseInt(møntIndkast.value))) {
        mønter += parseInt(møntIndkast.value);
        møntIndkast.value = "";
        updateCoinAndSpinCount();
        spilResultat.innerHTML = "";
        betalMønterBtnElement.blur();
        møntIndkast.style.backgroundColor = "white";
    }
    else {
        betalMønterBtnElement.blur();
        spilResultat.innerHTML = "Der kan kun indsættes tal i input feltet";
        møntIndkast.style.backgroundColor = "red";
    }
    møntIndkast.blur();
}

document.addEventListener('keydown', keyPress);
function keyPress(e) {
    if (e.keyCode == 32 && !currentlySpinning) {
        userInitiatedMachine();
    }
    if (e.keyCode == 13) {
        depositCoins();
    }
}

startBtnElement.addEventListener('click', () => {
    userInitiatedMachine();
});

autoBtnElement.addEventListener('click', () => {
    if (!autoSpinActive) { // If auto spin is not currently activated.
        if (!currentlySpinning) { // If the machine is not currently spinning.
            userInitiatedMachine();
            autoSpinInterval = setInterval(() => {
                userInitiatedMachine();
            }, 6300);
            autoSpinActive = true;
            autoBtnElement.innerHTML = "Stop Auto";
        }
    }
    else if (autoSpinActive) {
        clearInterval(autoSpinInterval);
        autoSpinActive = false;
        autoBtnElement.innerHTML = "Auto Spil";
    }
    ;
});

holdRulle1Btn.addEventListener('click', (event) => {
    if (!holdRulle1Boolean) {
        holdRulle1Btn.style.backgroundColor = "green";
        holdRulle1Btn.innerHTML = "Release";
        holdRulle1Boolean = true;
    }
    else {
        holdRulle1Btn.style.backgroundColor = "rgb(223, 61, 61)";
        holdRulle1Btn.innerHTML = "Hold";
        holdRulle1Boolean = false;
    }
});

holdRulle2Btn.addEventListener('click', (event) => {
    if (!holdRulle2Boolean) {
        holdRulle2Btn.style.backgroundColor = "green";
        holdRulle2Btn.innerHTML = "Release";
        holdRulle2Boolean = true;
    }
    else {
        holdRulle2Btn.style.backgroundColor = "rgb(223, 61, 61)";
        holdRulle2Btn.innerHTML = "Hold";
        holdRulle2Boolean = false;
    }
});

holdRulle3Btn.addEventListener('click', (event) => {
    if (!holdRulle3Boolean) {
        holdRulle3Btn.style.backgroundColor = "green";
        holdRulle3Btn.innerHTML = "Release";
        holdRulle3Boolean = true;
    }
    else {
        holdRulle3Btn.style.backgroundColor = "rgb(223, 61, 61)";
        holdRulle3Btn.innerHTML = "Hold";
        holdRulle3Boolean = false;
    }
});

function userInitiatedMachine() {
    if (mønter >= allowSpin || freeSpinCount != 0) {
        gameCount++;
        currentlySpinning = true;
        spilResultat.innerHTML = "";
        audioElement.pause();
        audioElement.currentTime = 0;
        startBtnElement.disabled = true;

        if (!holdRulle1Boolean) {
            makeRulle1();
        }
        if (!holdRulle2Boolean) {
            makeRulle2();
        }
        if (!holdRulle3Boolean) {
            makeRulle3();
        }

        if (freeSpinCount == 0) {
            mønter -= allowSpin;
        }
        if (freeSpinCount > 0) {
            freeSpinCount--;
        }
        let forskydning = (X * arrayExtentions / 4); //20 * ArrayExtentions(5) / 4
        rulle1Index = randomIntFromInterval(0, X) + (Math.floor(forskydning) * 1);
        rulle2Index = randomIntFromInterval(0, X) + (Math.floor(forskydning) * 2);
        rulle3Index = randomIntFromInterval(0, X) + (Math.floor(forskydning) * 3);
        // console.log(`Rulle1 kan ramme mellem Index ${(0 + (Math.floor(forskydning)) * 1)} Og ${(X + (Math.floor(forskydning)) * 1)}`);
        // console.log(`Rulle2 kan ramme mellem Index ${(0 + (Math.floor(forskydning)) * 2)} Og ${(X + (Math.floor(forskydning)) * 2)}`);
        // console.log(`Rulle3 kan ramme mellem Index ${(0 + (Math.floor(forskydning)) * 3)} Og ${(X + (Math.floor(forskydning)) * 3)}`);
        // console.log(rullerArray[0].slice(25, 45));
        // console.log(rullerArray[1].slice(50, 70));
        // console.log(rullerArray[2].slice(75, 95));
        startSpinning(rulle1Index, rulle2Index, rulle3Index);
    }
    else {
        spilResultat.innerHTML = "Indsæt flere penge for at spille videre";
        setTimeout(() => {
            møntIndkast.focus();
            clearInterval(autoSpinInterval);
        }, 10);
    }
    updateCoinAndSpinCount();
}

function updateCoinAndSpinCount() {
    mønterElement.innerHTML = `Coin: ${mønter.toString()}`;
    if (freeSpinCount <= 1) {
        freeSpinsDisplayElement.innerHTML = `Free Spin: ${freeSpinCount.toString()}`;
        return;
    }
    freeSpinsDisplayElement.innerHTML = `Free Spins: ${freeSpinCount.toString()}`;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function startSpinning(Number1, Number2, Number3) {
    setTimeout(() => {
        // if(!holdRulle1Boolean || !holdRulle2Boolean || !holdRulle3Boolean)
        if (holdRulle1Boolean) {
            rulle1Overflowing.style.transition = "unset";
        }
        else {
            rulle1Overflowing.style.transition = "all 3s ease-out";
            rulle1Overflowing.style.marginTop = `${-Number1 * figurHøjde}px`;
        }
        if (holdRulle2Boolean) {
            rulle2Overflowing.style.transition = "unset";
        }
        else {
            rulle2Overflowing.style.transition = "all 4s ease-out";
            rulle2Overflowing.style.marginTop = `${-Number2 * figurHøjde}px`;
        }
        if (holdRulle3Boolean) {
            rulle3Overflowing.style.transition = "unset";
        }
        else {
            rulle3Overflowing.style.transition = "all 5s ease-out";
            rulle3Overflowing.style.marginTop = `${-Number3 * figurHøjde}px`;
        }

    }, 15);
}

rulle1Overflowing.addEventListener('transitionend', () => {
    rulle1VenstreTop = rullerArray[0][rulle1Index];
    rulle1VenstreCenter = rullerArray[0][rulle1Index + 1];
    rulle1VenstreBund = rullerArray[0][rulle1Index + 2];
    if(holdRulle2Boolean && holdRulle3Boolean){
        winOrLose();
    }
});

rulle2Overflowing.addEventListener('transitionend', () => {
    rulle2Center = rullerArray[1][rulle2Index + 1];
    if(holdRulle3Boolean){
        winOrLose();
    }
});

rulle3Overflowing.addEventListener('transitionend', () => {
    rulle3HøjreTop = rullerArray[2][rulle3Index];
    rulle3HøjreCenter = rullerArray[2][rulle3Index + 1];
    rulle3HøjreBund = rullerArray[2][rulle3Index + 2];
    winOrLose();
    audioElement.pause();
    audioElement.currentTime = 0;
});

function winOrLose() {
    holdRulle1Btn.disabled = false;
    holdRulle2Btn.disabled = false;
    holdRulle3Btn.disabled = false;
    if (rulle1VenstreCenter.name === rulle2Center.name && rulle2Center.name === rulle3HøjreCenter.name) {
        winCount++;
        startBtnElement.disabled = false;
        mønter += rulle1VenstreCenter.value;
        spilResultat.innerHTML = `Du ramte 3 <img class="spil-resultat-image" src="assets/image/${rulle2Center.file}"> og vandt ${rulle1VenstreCenter.value}`;
        audioElement.play();
        audioElement.volume = 0.1;
        updateCoinAndSpinCount();
    }

    else if (rulle1VenstreTop.name === rulle2Center.name && rulle2Center.name === rulle3HøjreBund.name) {
        winCount++;
        startBtnElement.disabled = false;
        freeSpinTracker();
        spilResultat.innerHTML = `Du ramte 3 <img class="spil-resultat-image" src="assets/image/${rulle2Center.file}"> på tværs, Du har ${freeSpinCount} free spins`;
        updateCoinAndSpinCount();
    }

    else if (rulle1VenstreBund.name === rulle2Center.name && rulle2Center.name === rulle3HøjreTop.name) {
        winCount++;
        startBtnElement.disabled = false;
        freeSpinTracker();
        spilResultat.innerHTML = `Du ramte 3 <img class="spil-resultat-image" src="assets/image/${rulle2Center.file}"> på tværs, Du har ${freeSpinCount} free spins`;
        updateCoinAndSpinCount();
    }

    else {
        startBtnElement.disabled = false;
        spilResultat.innerHTML = "Du vandt ikke, Prøv igen!";
    }
    currentlySpinning = false;
    if (gameCount / winCount != Infinity) {
        winRateDisplayElement.innerHTML = `Win-rate: ${((winCount / gameCount) * 100).toFixed(1)}%`;
    }
    gameCountDisplayElement.innerHTML = `T: ${gameCount} | L: ${(gameCount - winCount)} | W: ${winCount}`;
}

function freeSpinTracker() {
    if (rulle2Center.name == "melon" || rulle2Center.name == "appelsin") {
        freeSpinCount += 2;
    }
    if (rulle2Center.name == "blomme") {
        freeSpinCount += 3;
    }
    if (rulle2Center.name == "bar") {
        freeSpinCount += 5;
    }
    if (rulle2Center.name == "7") {
        freeSpinCount += 10;
    }
    if (rulle2Center.name == "diamant") {
        freeSpinCount += 25;
    }
}

