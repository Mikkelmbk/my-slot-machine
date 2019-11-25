(function () {
    let bodyElement = document.querySelector('body');
    let contentWrapperElement = document.querySelector('.content-wrapper');
    let controlsElement = document.querySelector('.controls');
    let logoutBtnElement = document.querySelector('.logout-btn');
    let rulle1OverflowingElement = document.querySelector('.rulle1-overflowing');
    let rulle2OverflowingElement = document.querySelector('.rulle2-overflowing');
    let rulle3OverflowingElement = document.querySelector('.rulle3-overflowing');
    let prizeDisplayElement = document.querySelector('.gevinst-ul');
    let startBtnElement = document.querySelector('.start-btn');
    let autoBtnElement = document.querySelector('.auto-btn');
    let depositCoinBtnElement = document.querySelector('.betal-mønter');
    let coinDepositElement = document.querySelector('.mønt-indkast');
    let coinInputFieldHasFocus = false;
    let rulle1Element = document.querySelector('.rulle1');
    let coinsElement = document.querySelector('.mønter');
    let winRateDisplayElement = document.querySelector('.win-rate');
    let gameResultElement = document.querySelector('.spil-resultat');
    let freeSpinsDisplayElement = document.querySelector('.free-spins');
    let gameCountDisplayElement = document.querySelector('.game-count');
    let audioElement = document.querySelector('audio');

    let holdRulle1BtnElement = document.querySelector('.hold-rulle1');
    holdRulle1BtnElement.disabled = true;
    let holdRulle1Boolean = false;
    let holdRulle2BtnElement = document.querySelector('.hold-rulle2');
    holdRulle2BtnElement.disabled = true;
    let holdRulle2Boolean = false;
    let holdRulle3BtnElement = document.querySelector('.hold-rulle3');
    holdRulle3BtnElement.disabled = true;
    let holdRulle3Boolean = false;
    let rulleLockCount = 0;
    let rulleWasHeldLastSpin = false;

    let figureHeight = Math.floor(rulle1Element.offsetHeight / 3);
    let coins = 200;
    let allowSpin = 10;
    let currentlySpinning = true;
    let freeSpinCount = 0;
    let arrayExtentions = 5;
    let gameCount = 0;
    let winCount = 0;
    let autoSpinActive = false;
    let autoSpinInterval;
    updateCoinAndSpinCount();
    winRateDisplayElement.innerHTML = "Win-rate: 0%";
    gameCountDisplayElement.innerHTML = `T: 0 | L: 0 | W: 0`;


    auth.onAuthStateChanged((user) => {
        if (user == null) {
            bodyElement.classList.remove('body-display');
            currentlySpinning = true;
            controlsElement.id = "hidden";
            gameResultElement.id = "hidden";
            contentWrapperElement.innerHTML = `
        <div class="form-container">
            <form class="loginForm">
            <div>
                <label>Email:</label>
                <input type="text" name="Email">
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="Password"></input>
            </div>
            <button class="login-btn">Login</button>
            </form>

            <form class="opretForm">
            <div>
                <label>Email:</label>
                <input type="text" name="Email">
            </div>
            <div>
                <label>Username:</label>
                <input type="text" name="Username">
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="Password"></input>
            </div>
            <button class="opret-btn">Create Account</button>
            </form>
            <button class="toggle-forms-btn">Click to display signup Form</button>
            <p class="error-message"></p>
        </div>
        `;
            let errorMessageElement = document.querySelector('.error-message');
            let loginFormElement = document.querySelector('.loginForm');
            loginFormElement.addEventListener('submit', (event) => {
                event.preventDefault();
                const email = loginFormElement.Email.value;
                const password = loginFormElement.Password.value;

                auth.signInWithEmailAndPassword(email, password)
                    .then((cred) => {
                        // console.log(cred);
                        loginFormElement.reset();

                        window.location.replace(window.location.href);
                    })
                    .catch((err) => {
                        console.log(err);
                        errorMessageElement.innerHTML = err;
                    })
            })

            let opretFormElement = document.querySelector('.opretForm');
            opretFormElement.addEventListener('submit', (event) => {
                event.preventDefault();
                const email = opretFormElement.Email.value;
                const name = opretFormElement.Username.value;
                const password = opretFormElement.Password.value;

                auth.createUserWithEmailAndPassword(email, password)
                    .then((cred) => {
                        // console.log(cred);
                        return db.collection('users').doc(cred.user.uid).set({
                            fullname: name,
                            coin: 200,
                            freespin: 0,


                        })
                    })
                    .then(() => {
                        window.location.replace(window.location.href);
                    })
                    .catch((err) => {
                        errorMessageElement.innerHTML = err;
                    })
            })
            opretFormElement.classList.add('hidden');
            loginFormElement.classList.add('formStyling');
            let toggleFormsBtn = document.querySelector('.toggle-forms-btn');
            toggleFormsBtn.addEventListener('click', () => {
                if (opretFormElement.classList.contains('hidden')) {
                    loginFormElement.classList.add('hidden');
                    loginFormElement.classList.remove('formStyling');
                    opretFormElement.classList.remove('hidden');
                    opretFormElement.classList.add('formStyling');
                    toggleFormsBtn.innerHTML = "Click to display login Form";
                    opretFormElement.reset();
                }
                else if (loginFormElement.classList.contains('hidden')) {
                    opretFormElement.classList.add('hidden');
                    opretFormElement.classList.remove('formStyling');
                    loginFormElement.classList.remove('hidden');
                    loginFormElement.classList.add('formStyling');
                    toggleFormsBtn.innerHTML = "Click to display signup Form";
                    loginFormElement.reset();
                }

            })


        } //user null check ends
        else {
            bodyElement.classList.add('body-display');

            db.collection('users').doc(user.uid).get()
                .then((userData) => {
                    // console.log(userData.data());
                    coins = userData.data().coin;
                    freeSpinCount = userData.data().freespin;
                    updateCoinAndSpinCount();
                    currentlySpinning = false;
                })
                .catch((err) => {
                    console.log(err);
                })
        }

    });


    // let Data = [
    // 	{
    // 		"name": "appelsin",
    // 		"rarity": 5,
    // 		"file": "appelsin.png",
    // 		"value": 50,
    //      "freeSpin":2,
    // 	},
    // 	{
    // 		"name": "bar",
    // 		"rarity": 3,
    // 		"file": "bar.png",
    // 		"value": 150,
    //      "freeSpin":5,
    // 	},
    // 	{
    // 		"name": "7",
    // 		"rarity": 2,
    // 		"file": "syv.png",
    // 		"value": 500,
    //      "freeSpin":10,
    // 	},
    // 	{
    // 		"name": "blomme",
    // 		"rarity": 4,
    // 		"file": "blomme.png",
    // 		"value": 80,
    //      "freeSpin":3,
    // 	},
    // 	{
    // 		"name": "diamant",
    // 		"rarity": 1,
    // 		"file": "diamant.png",
    // 		"value": 1000,
    //      "freeSpin":25,
    // 	},
    // 	{
    // 		"name": "melon",
    // 		"rarity": 5,
    // 		"file": "melon.png",
    // 		"value": 50,
    //      "freeSpin":2,
    // 	}
    // ];
    let Data = [
        {
            "name": "bar",
            "rarity": 4,
            "file": "bar.png",
            "value": 150,
            "freeSpin": 5,
        },
        {
            "name": "7",
            "rarity": 2,
            "file": "syv.png",
            "value": 500,
            "freeSpin": 10,
        },
        {
            "name": "blomme",
            "rarity": 6,
            "file": "blomme.png",
            "value": 80,
            "freeSpin": 3,
        },
        {
            "name": "diamant",
            "rarity": 1,
            "file": "diamant.png",
            "value": 1000,
            "freeSpin": 25,
        },
        {
            "name": "melon",
            "rarity": 7,
            "file": "melon.png",
            "value": 50,
            "freeSpin": 2,
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
        prizeDisplayElement.appendChild(gevinstDisplayFigurElement);
        let rarityDisplay = document.createElement('p');
        rarityDisplay.innerHTML = `Free Spins: ${figurObjekt.freeSpin}`;
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
    makeRulle2();
    makeRulle3();


    coinDepositElement.addEventListener('focusin', () => {
        coinInputFieldHasFocus = true;
    });
    coinDepositElement.addEventListener('focusout', () => {
        coinInputFieldHasFocus = false;
    });

    logoutBtnElement.addEventListener('click', () => {
        auth.signOut();
    })

    depositCoinBtnElement.addEventListener('click', () => {
        depositCoins();
    });

    document.addEventListener('keydown', keyPress);

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

    holdRulle1BtnElement.addEventListener('click', (event) => {
        holdRulle1();
        holdRulle1BtnElement.blur();
    });

    holdRulle2BtnElement.addEventListener('click', (event) => {
        holdRulle2();
        holdRulle2BtnElement.blur();
    });

    holdRulle3BtnElement.addEventListener('click', (event) => {
        holdRulle3();
        holdRulle3BtnElement.blur();
    });

    rulle1OverflowingElement.addEventListener('transitionend', () => {
        rulle1VenstreTop = rullerArray[0][rulle1Index];
        rulle1VenstreCenter = rullerArray[0][rulle1Index + 1];
        rulle1VenstreBund = rullerArray[0][rulle1Index + 2];
        if (holdRulle2Boolean && holdRulle3Boolean) {
            // console.log("Hvis Rulle 2 og Rulle 3 Bliver fastholdt");
            winOrLose();
        }
    });

    rulle2OverflowingElement.addEventListener('transitionend', () => {
        rulle2Center = rullerArray[1][rulle2Index + 1];
        if (holdRulle3Boolean) {
            // console.log("Hvis rulle 3 bliver fastholdt");
            winOrLose();
        }
    });

    rulle3OverflowingElement.addEventListener('transitionend', () => {
        rulle3HøjreTop = rullerArray[2][rulle3Index];
        rulle3HøjreCenter = rullerArray[2][rulle3Index + 1];
        rulle3HøjreBund = rullerArray[2][rulle3Index + 2];
        // console.log("Hvis Rulle 1 og 2 bliver fastholdt");
        winOrLose();
        audioElement.pause();
        audioElement.currentTime = 0;
    });


    // Function Definition Section Starts.
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

    function makeRulle1() {
        rulle1OverflowingElement.style.transition = "unset";
        rulle1OverflowingElement.innerHTML = "";
        rulle1OverflowingElement.style.marginTop = "0";
        rullerArray[0].forEach((rulle1) => {
            let rulleFigur = document.createElement('img');
            rulleFigur.style.height = `${figureHeight}px`;
            rulleFigur.src = `assets/image/${rulle1.file}`;
            rulleFigur.classList.add('rulle-figur');
            rulle1OverflowingElement.appendChild(rulleFigur);
        });


    }

    function makeRulle2() {
        rulle2OverflowingElement.style.transition = "unset";
        rulle2OverflowingElement.innerHTML = "";
        rulle2OverflowingElement.style.marginTop = "0";
        rullerArray[1].forEach((rulle2) => {
            let rulleFigur = document.createElement('img');
            rulleFigur.style.height = `${figureHeight}px`;
            rulleFigur.src = `assets/image/${rulle2.file}`;
            rulleFigur.classList.add('rulle-figur');
            rulle2OverflowingElement.appendChild(rulleFigur);
        });
    }

    function makeRulle3() {
        rulle3OverflowingElement.style.transition = "unset";
        rulle3OverflowingElement.innerHTML = "";
        rulle3OverflowingElement.style.marginTop = "0";
        rullerArray[2].forEach((rulle3) => {
            let rulleFigur = document.createElement('img');
            rulleFigur.style.height = `${figureHeight}px`;
            rulleFigur.src = `assets/image/${rulle3.file}`;
            rulleFigur.classList.add('rulle-figur');
            rulle3OverflowingElement.appendChild(rulleFigur);
        });
    }

    function depositCoins() {
        if (!isNaN(parseInt(coinDepositElement.value))) {
            coins += parseInt(coinDepositElement.value);
            coinDepositElement.value = "";
            updateCoinAndSpinCount();
            gameResultElement.innerHTML = "";
            depositCoinBtnElement.blur();
            coinDepositElement.style.backgroundColor = "white";
            updateDatabase(auth.currentUser.uid);
        }
        else {
            depositCoinBtnElement.blur();
            gameResultElement.innerHTML = "Only numbers are allowed";
            coinDepositElement.style.backgroundColor = "red";
        }
        coinDepositElement.blur();
    }

    function keyPress(e) {
        // console.log(e);
        if (e.keyCode == 32 && !currentlySpinning) {
            userInitiatedMachine();
        }
        if (e.keyCode == 13 && coinInputFieldHasFocus) {
            depositCoins();
        }

        if (e.keyCode == 49 && !holdRulle1BtnElement.disabled && !coinInputFieldHasFocus) {
            holdRulle1();
        }
        if (e.keyCode == 50 && !holdRulle2BtnElement.disabled && !coinInputFieldHasFocus) {
            holdRulle2();
        }
        if (e.keyCode == 51 && !holdRulle3BtnElement.disabled && !coinInputFieldHasFocus) {
            holdRulle3();
        }

        // Numpad 1, 2, 3
        if (e.keyCode == 97 && !holdRulle1BtnElement.disabled && !coinInputFieldHasFocus) {
            holdRulle1();
        }
        if (e.keyCode == 98 && !holdRulle2BtnElement.disabled && !coinInputFieldHasFocus) {
            holdRulle2();
        }
        if (e.keyCode == 99 && !holdRulle3BtnElement.disabled && !coinInputFieldHasFocus) {
            holdRulle3();
        }
    }

    function holdRulle1() {
        if (!holdRulle1Boolean && coins >= 10) {
            if (rulleLockCount <= 1 && !currentlySpinning && !rulleWasHeldLastSpin) {
                holdRulle1BtnElement.style.backgroundColor = "green";
                holdRulle1BtnElement.innerHTML = "Release";
                holdRulle1Boolean = true;
                coins -= 10;
                rulleLockCount++;
                updateCoinAndSpinCount();
                updateDatabase(auth.currentUser.uid);
            }
        }
        else {
            holdRulle1BtnElement.style.backgroundColor = "rgb(223, 61, 61)";
            holdRulle1BtnElement.innerHTML = "Hold";
            holdRulle1Boolean = false;
            rulleLockCount--;
            if (rulleLockCount < 0) {
                rulleLockCount = 0;
            }
        }
    }

    function holdRulle2() {
        if (!holdRulle2Boolean && coins >= 10) {
            if (rulleLockCount <= 1 && !currentlySpinning && !rulleWasHeldLastSpin) {
                holdRulle2BtnElement.style.backgroundColor = "green";
                holdRulle2BtnElement.innerHTML = "Release";
                holdRulle2Boolean = true;
                coins -= 10;
                rulleLockCount++;
                updateCoinAndSpinCount();
                updateDatabase(auth.currentUser.uid);
            }
        }
        else {
            holdRulle2BtnElement.style.backgroundColor = "rgb(223, 61, 61)";
            holdRulle2BtnElement.innerHTML = "Hold";
            holdRulle2Boolean = false;
            rulleLockCount--;
            if (rulleLockCount < 0) {
                rulleLockCount = 0;
            }
        }
    }

    function holdRulle3() {
        if (!holdRulle3Boolean && coins >= 10) {
            if (rulleLockCount <= 1 && !currentlySpinning && !rulleWasHeldLastSpin) {
                holdRulle3BtnElement.style.backgroundColor = "green";
                holdRulle3BtnElement.innerHTML = "Release";
                holdRulle3Boolean = true;
                coins -= 10;
                rulleLockCount++;
                updateCoinAndSpinCount();
                updateDatabase(auth.currentUser.uid);
            }
        }
        else {
            holdRulle3BtnElement.style.backgroundColor = "rgb(223, 61, 61)";
            holdRulle3BtnElement.innerHTML = "Hold";
            holdRulle3Boolean = false;
            rulleLockCount--;
            if (rulleLockCount < 0) {
                rulleLockCount = 0;
            }
        }
    }

    function userInitiatedMachine() {
        if (coins >= allowSpin || freeSpinCount != 0) {
            gameCount++;
            currentlySpinning = true;
            gameResultElement.innerHTML = "";
            audioElement.pause();
            audioElement.currentTime = 0;
            startBtnElement.disabled = true;
            holdRulle1BtnElement.disabled = true;
            holdRulle2BtnElement.disabled = true;
            holdRulle3BtnElement.disabled = true;

            if (!holdRulle1Boolean) {
                makeRulle1();
                rulleWasHeldLastSpin = false;
            }
            
            if (!holdRulle2Boolean) {
                makeRulle2();
                rulleWasHeldLastSpin = false;
            }
           
            if (!holdRulle3Boolean) {
                makeRulle3();
                rulleWasHeldLastSpin = false;
            }
            if (holdRulle1Boolean || holdRulle2Boolean || holdRulle3Boolean) {
                rulleWasHeldLastSpin = true;
                console.log(rulleWasHeldLastSpin)
            }

            if (freeSpinCount == 0) {
                coins -= allowSpin;
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
            gameResultElement.innerHTML = "Indsæt flere penge for at spille videre";
            setTimeout(() => {
                coinDepositElement.focus();
                clearInterval(autoSpinInterval);
                autoSpinActive = false;
                autoBtnElement.innerHTML = "Auto Spil";
            }, 10);
        }
        updateCoinAndSpinCount();
    }

    function updateCoinAndSpinCount() {
        coinsElement.innerHTML = `Coin: ${coins.toString()}`;
        freeSpinsDisplayElement.innerHTML = `Free Spin: ${freeSpinCount.toString()}`;
    }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function startSpinning(Number1, Number2, Number3) {
        setTimeout(() => {
            if (holdRulle1Boolean) {
                rulle1OverflowingElement.style.transition = "unset";
            }
            else {
                rulle1OverflowingElement.style.transition = "all 3s ease-out";
                rulle1OverflowingElement.style.marginTop = `${-Number1 * figureHeight}px`;
            }
            if (holdRulle2Boolean) {
                rulle2OverflowingElement.style.transition = "unset";
            }
            else {
                rulle2OverflowingElement.style.transition = "all 4s ease-out";
                rulle2OverflowingElement.style.marginTop = `${-Number2 * figureHeight}px`;
            }
            if (holdRulle3Boolean) {
                rulle3OverflowingElement.style.transition = "unset";
            }
            else {
                rulle3OverflowingElement.style.transition = "all 5s ease-out";
                rulle3OverflowingElement.style.marginTop = `${-Number3 * figureHeight}px`;
            }

        }, 15);
    }

    function winOrLose() {

        holdRulle1BtnElement.disabled = false;
        holdRulle2BtnElement.disabled = false;
        holdRulle3BtnElement.disabled = false;

        if (holdRulle1Boolean) {
            holdRulle1();
        }
        if (holdRulle2Boolean) {
            holdRulle2();
        }
        if (holdRulle3Boolean) {
            holdRulle3();
        }
        if (rulle1VenstreCenter.name === rulle2Center.name && rulle2Center.name === rulle3HøjreCenter.name) {
            winCount++;
            startBtnElement.disabled = false;
            coins += rulle1VenstreCenter.value;
            gameResultElement.innerHTML = `Du ramte 3 <img class="spil-resultat-image" src="assets/image/${rulle2Center.file}"> og vandt ${rulle1VenstreCenter.value}`;
            audioElement.play();
            audioElement.volume = 0.1;
            updateCoinAndSpinCount();

        }

        else if (rulle1VenstreTop.name === rulle2Center.name && rulle2Center.name === rulle3HøjreBund.name) {
            winCount++;
            startBtnElement.disabled = false;
            freeSpinTracker();
            gameResultElement.innerHTML = `Du ramte 3 <img class="spil-resultat-image" src="assets/image/${rulle2Center.file}"> på tværs, Du får ${rulle2Center.freeSpin} free spins`;
            updateCoinAndSpinCount();
        }

        else if (rulle1VenstreBund.name === rulle2Center.name && rulle2Center.name === rulle3HøjreTop.name) {
            winCount++;
            startBtnElement.disabled = false;
            freeSpinTracker();
            gameResultElement.innerHTML = `Du ramte 3 <img class="spil-resultat-image" src="assets/image/${rulle2Center.file}"> på tværs, Du får ${rulle2Center.freeSpin} free spins`;
            updateCoinAndSpinCount();
        }

        else {
            startBtnElement.disabled = false;
            gameResultElement.innerHTML = "Du vandt ikke, Prøv igen!";
        }
        if (gameCount / winCount != Infinity) {
            winRateDisplayElement.innerHTML = `Win-rate: ${((winCount / gameCount) * 100).toFixed(1)}%`;
        }
        gameCountDisplayElement.innerHTML = `T: ${gameCount} | L: ${(gameCount - winCount)} | W: ${winCount}`;

        currentlySpinning = false;

        updateDatabase(auth.currentUser.uid);
    }

    function updateDatabase(userUid) {
        db.collection('users').doc(userUid).update({
            coin: coins,
            freespin: freeSpinCount,
        });
    }

    function freeSpinTracker() {
        freeSpinCount += rulle2Center.freeSpin;
    }
    // Function Definition Section Ends.

}());

