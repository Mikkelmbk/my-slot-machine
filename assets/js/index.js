(function () {

    // Reference Section Starts.
    let bodyElement = document.querySelector('body');
    let contentWrapperElement = document.querySelector('.content-wrapper');
    let controlsElement = document.querySelector('.controls');
    let logoutBtnElement = document.querySelector('.logout-btn');
    let rulle1OverflowingElement = document.querySelector('.rulle1-overflowing');
    let rulle2OverflowingElement = document.querySelector('.rulle2-overflowing');
    let rulle3OverflowingElement = document.querySelector('.rulle3-overflowing');
    let prizeDisplayElement = document.querySelector('.gevinst-ul');
    let gameGuideDisplayElement = document.querySelector('.game-guide');
    let startBtnElement = document.querySelector('.start-btn');
    let autoBtnElement = document.querySelector('.auto-btn');
    let depositCoinBtnElement = document.querySelector('.betal-mønter');
    let coinDepositElement = document.querySelector('.mønt-indkast');
    let rulle1Element = document.querySelector('.rulle1');
    let coinsElement = document.querySelector('.mønter');
    // let winRateDisplayElement = document.querySelector('.win-rate');
    let gameResultElement = document.querySelector('.spil-resultat');
    let gameResultContainerElement = document.querySelector('.spil-resultat-container');
    let freeSpinsDisplayElement = document.querySelector('.free-spins');
    // let gameCountDisplayElement = document.querySelector('.game-count');
    let audioElement = document.querySelector('audio');
    let gameOverlayElement = document.querySelector('.overlay');
    let gameInfoBtnElement = document.querySelector('.game-info');
    let holdRulle1BtnElement = document.querySelector('.hold-rulle1');
    let holdRulle2BtnElement = document.querySelector('.hold-rulle2');
    let holdRulle3BtnElement = document.querySelector('.hold-rulle3');
    let scoreboardTableElement = document.querySelector('.scoreboard-container tbody');
    let scoreboardWinRateToggleElement = document.querySelector('.table-winrate');
    let unsubscribePlayerWhenLoggedOff;

    let chatFormElem = document.querySelector('.chat-form');
    let chatFormInputElem = chatFormElem.querySelector(".chatFormMessage");
    let chatElem = document.querySelector(".chat");
    let chatMessageContainerElem = document.querySelector('.chat-messagecontainer');
    let chatMessageTemplateElem = document.querySelector('.html-templates .chat-message');
    let newMessage = false;
    let userinfo;
    //Emoji's :D
    let emojiContainer = document.querySelector(".emojipopup-emojicontainer");
    let emojiPopUpElem = document.querySelector(".emojipopup");

    let chatFormEmojiBtnElem = chatFormElem.querySelector(".chat-form__emoji-button");
    let inputStart, inputEnd;
    let inputfocused = false;

    let emojiRange = [
        [128512, 128591], [9986, 10160], [128640, 128704]
    ];

    for (var i = 0; i < emojiRange.length; i++) {
        let range = emojiRange[i];
        for (var x = range[0]; x < range[1]; x++) {
            let emoji = document.createElement('span');
            emoji.innerHTML = "&#" + x + ";";
            emoji.classList.add("emojipopup-emoji");
            emojiContainer.appendChild(emoji);
        }
    }
    // Reference Section Ends.

    // Conditions Section Starts.
    let coinInputFieldHasFocus = false;
    let holdRulle1Boolean = false;
    let holdRulle2Boolean = false;
    let holdRulle3Boolean = false;
    let rulleLockCount = 0;
    let rulleWasHeldLastSpin = false;
    let currentlySpinning = true;
    let autoSpinActive = false;
    let allowSpin = 10;
    let freeSpinCount = 0;
    let autoPlayWhileOverlayActivated = false; // If auto play is activated, and you click on Game info, and click away from it while the game is still finishing the last spin, this boolean will prevent currentlySpinning to be set to true before the final spin has ended.
    // Condition Section Ends.


    // Values Section Starts.
    let coins = 200;
    let arrayExtentions = 5;
    let gameCount = 0;
    let winCount = 0;
    let autoSpinInterval;
    let figureHeight = Math.floor(rulle1Element.offsetHeight / 3);
    // Values Section Ends.


    holdRulle2BtnElement.disabled = true;
    holdRulle3BtnElement.disabled = true;
    holdRulle1BtnElement.disabled = true;
    updateCoinAndSpinCount();
    // winRateDisplayElement.innerHTML = "Win-rate: 0%";
    // gameCountDisplayElement.innerHTML = `T: 0 | L: 0 | W: 0`;

    Notification.requestPermission();

    // auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    auth.onAuthStateChanged((user) => {
        if (user == null) {

            sessionStorage.clear();
            console.log(sessionStorage.getItem('userId'));

            chatFormElem.chatFormMessage.disabled = true;
            chatFormElem.chatFormButton.disabled = true;
            chatFormElem.chatFormMessage.placeholder = "Please login to type in the chat";

            if (unsubscribePlayerWhenLoggedOff != undefined) {
                unsubscribePlayerWhenLoggedOff(); // stop the scoreboard Snapshot when the user is not logged in
            }
            bodyElement.classList.remove('body-display');
            currentlySpinning = true;
            controlsElement.id = "hidden";
            gameResultContainerElement.id = "hidden";
            contentWrapperElement.classList.add('content-wrapper-logged-out');
            contentWrapperElement.classList.remove('content-wrapper-logged-in');
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
                        return db.collection('users').doc(cred.user.uid).set({
                            fullname: name,
                            coin: 200,
                            freespin: 0,
                            lifeTimeGames: 0,
                            lifeTimeWins: 0,
                            lifeTimeWinnings: 0,
                            sessionGames: 0,
                            sessionWins: 0,
                            sessionWinnings: 0,
                            isOnline: true,



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

            if(sessionStorage.getItem('userId') == null){
                closingCode();
            }
            chatFormElem.chatFormMessage.disabled = false;
            chatFormElem.chatFormButton.disabled = false;
            chatFormElem.chatFormMessage.placeholder = "Message...";
            db.collection("users").doc(user.uid).get().then((currentUserDoc) => {
                userinfo = currentUserDoc.data();
                db.collection("chat").orderBy("postTime", "desc").onSnapshot(snapshot => {
                    let messagedocs = [];
                    changes = snapshot.docChanges()
                    changes.forEach((change) => {
                        if (change.type == "added") {

                            db.collection("users").doc(change.doc.data().author).get().then((userDoc) => {
                                messagedocs.push({ doc: change.doc, userDoc: userDoc, })
                                if (messagedocs.length == changes.length) {
                                    sortMessageArray(messagedocs);
                                }
                            })
                        } else if (change.type == "removed") {
                            chatElem.querySelector(`[data-id='${change.doc.id}']`).remove()
                        }
                    });
                })
            })
            bodyElement.classList.add('body-display');
            contentWrapperElement.classList.remove('content-wrapper-logged-out');
            contentWrapperElement.classList.add('content-wrapper-logged-in');

            db.collection('users').doc(user.uid).update({
                isOnline: true,
            });

            db.collection('users').doc(user.uid).get()
                .then((userData) => {
                    coins = userData.data().coin;
                    freeSpinCount = userData.data().freespin;
                    gameCount = userData.data().sessionGames;
                    winCount = userData.data().sessionWins;

                    if (userData.data().sessionWinnings == undefined && userData.data().lifeTimeWinnings == undefined) {
                        db.collection('users').doc(user.uid).update({
                            sessionWinnings: 0,
                            lifeTimeWinnings: 0,
                        })

                    }

                    // if (gameCount != 0 && winCount != 0) {
                    //     // winRateDisplayElement.innerHTML = `Win-rate: ${((winCount / gameCount) * 100).toFixed(1)}%`;
                    // }
                    // gameCountDisplayElement.innerHTML = `T: ${userData.data().sessionGames} | L: ${(userData.data().sessionGames - userData.data().sessionWins)} | W: ${userData.data().sessionWins}`;
                    updateCoinAndSpinCount();
                    currentlySpinning = false;
                })
                .catch((err) => {
                    console.log(err);
                })

        }
        // if(sessionStorage.getItem('userId') == null){
        //     closingCode();
        // }

        sessionStorage.setItem('userId',user.uid);
        console.log(sessionStorage.getItem('userId'));

    });


    unsubscribePlayerWhenLoggedOff = db.collection('users').orderBy("sessionWins", "desc").onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {

            if (change.doc.data().isOnline) {

                if (change.type == "added") {

                    let tr = document.createElement('tr');
                    tr.setAttribute("data-tr-id", change.doc.id);
                    let tdName = document.createElement('td');
                    let tdwinRate = document.createElement('td');
                    let tdGames = document.createElement('td');
                    let tdWins = document.createElement('td');
                    let tdWinnings = document.createElement('td');

                    tdName.innerHTML = change.doc.data().fullname;
                    if (change.doc.data().sessionGames != 0 && change.doc.data().sessionWins != 0) {
                        tdwinRate.innerHTML = `${((change.doc.data().sessionWins / change.doc.data().sessionGames) * 100).toFixed(1)}%`
                    }
                    else {
                        tdwinRate.innerHTML = `0%`;
                    }

                    tdGames.innerHTML = change.doc.data().sessionGames;
                    tdWins.innerHTML = change.doc.data().sessionWins;
                    tdWinnings.innerHTML = change.doc.data().sessionWinnings;


                    scoreboardTableElement.appendChild(tr);
                    tr.appendChild(tdName);
                    tr.appendChild(tdwinRate);
                    tr.appendChild(tdGames);
                    tr.appendChild(tdWins);
                    tr.appendChild(tdWinnings);

                }

                if (change.type == "modified") {

                    let trToChange = scoreboardTableElement.querySelector(`[data-tr-id=${change.doc.id}]`);
                    // console.log(trToChange);

                    if (trToChange == undefined) { // If there are no trToChange with the querySelected doc.id, then the tr element hasn't been created, so then we create it.

                        let tr = document.createElement('tr');
                        tr.setAttribute("data-tr-id", change.doc.id);
                        let tdName = document.createElement('td');
                        let tdwinRate = document.createElement('td');
                        let tdGames = document.createElement('td');
                        let tdWins = document.createElement('td');
                        let tdWinnings = document.createElement('td');

                        tdName.innerHTML = change.doc.data().fullname;
                        if (change.doc.data().sessionGames != 0 && change.doc.data().sessionWins != 0) {
                            tdwinRate.innerHTML = `${((change.doc.data().sessionWins / change.doc.data().sessionGames) * 100).toFixed(1)}%`
                        }
                        else {
                            tdwinRate.innerHTML = `0%`;
                        }

                        tdGames.innerHTML = change.doc.data().sessionGames;
                        tdWins.innerHTML = change.doc.data().sessionWins;
                        tdWinnings.innerHTML = change.doc.data().sessionWinnings;


                        scoreboardTableElement.appendChild(tr);
                        tr.appendChild(tdName);
                        tr.appendChild(tdwinRate);
                        tr.appendChild(tdGames);
                        tr.appendChild(tdWins);
                        tr.appendChild(tdWinnings);

                        trToChange = tr; // put tr into trToChange so that the if and else statements below has the right element.
                    }

                    if (change.doc.data().sessionGames != 0 && change.doc.data().sessionWins != 0) {
                        trToChange.children[1].innerHTML = `${((change.doc.data().sessionWins / change.doc.data().sessionGames) * 100).toFixed(1)}%`
                    }
                    else {
                        trToChange.children[1].innerHTML = `0%`;
                    }

                    trToChange.children[2].innerHTML = change.doc.data().sessionGames;
                    trToChange.children[3].innerHTML = change.doc.data().sessionWins;
                    trToChange.children[4].innerHTML = change.doc.data().sessionWinnings;



                }

                if (change.type == "removed") {
                    scoreboardTableElement.querySelector(`[data-tr-id=${change.doc.id}]`).remove();

                }

            }

            else {

                let trToChange = scoreboardTableElement.querySelector(`[data-tr-id=${change.doc.id}]`);
                if (trToChange != undefined) {

                    trToChange.remove();
                }


            }
        })

        sortScoreboard();

    }) // snapshot Ends
    {
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

    }
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



    // EventListeners Section Start.

    chatFormElem.addEventListener("submit", (event) => {
        event.preventDefault();
        let date = new Date();
        if (auth.currentUser != null) {
            if (chatFormElem.chatFormMessage.value != "") {
                db.collection("chat").add({
                    postTime: date.getTime(),
                    author: auth.currentUser.uid,
                    message: chatFormElem.chatFormMessage.value
                })
            }
        }
        chatFormElem.reset();
    })

    chatFormInputElem.addEventListener("keyup", () => {
        updateInputSelection();
    })
    chatFormInputElem.addEventListener("mouseup", () => {
        updateInputSelection();
    })

    emojiPopUpElem.addEventListener("mouseleave", (event) => {
        chatFormElem.emojispopupcheckbox.checked = false;
    })

    emojiContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("emojipopup-emoji")) {
            const value = chatFormElem.chatFormMessage.value;

            if (inputStart == undefined || inputStart == 0 && inputEnd == 0 || inputEnd == undefined) {
                chatFormElem.chatFormMessage.value += event.target.textContent;
                inputStart = inputEnd = 2;
            } else {
                chatFormElem.chatFormMessage.value = value.slice(0, inputStart) + event.target.textContent + value.slice(inputEnd);
            }

            // update cursor to be at the end of insertion
            chatFormElem.chatFormMessage.selectionStart = chatFormElem.chatFormMessage.selectionEnd = inputStart = inputEnd = inputStart + event.target.textContent.length;
            chatFormInputElem.focus();
        }
    })

    bodyElement.addEventListener('mouseleave', () => {
        clearingAutoInterval();
    });

    coinDepositElement.addEventListener('focusin', () => {
        coinInputFieldHasFocus = true;
    });
    coinDepositElement.addEventListener('focusout', () => {
        coinInputFieldHasFocus = false;
    });

    chatFormInputElem.addEventListener('focusin',()=>{
        coinInputFieldHasFocus = true;
    });
    chatFormInputElem.addEventListener('focusout',()=>{
        coinInputFieldHasFocus = false;
    });

    logoutBtnElement.addEventListener('click', () => {

        closingCode();
        auth.signOut();
    });

    window.onbeforeunload = closingCode;

    depositCoinBtnElement.addEventListener('click', () => {
        depositCoins();
    });

    document.addEventListener('keydown', keyPress);

    startBtnElement.addEventListener('click', () => {
        if (!currentlySpinning) {
            userInitiatedMachine();
        }
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
            clearingAutoInterval();
        };
    });

    gameInfoBtnElement.addEventListener('click', () => {
        gameOverlayElement.style.display = "flex";
        currentlySpinning = true;
        contentWrapperElement.style.opacity = 0;
        gameResultContainerElement.style.opacity = 0;
        if (autoSpinInterval != null) {
            autoPlayWhileOverlayActivated = true;
        }
        clearingAutoInterval();
    });

    gameOverlayElement.addEventListener('click', () => {
        gameOverlayElement.style.display = "none";
        contentWrapperElement.style.opacity = 1;
        gameResultContainerElement.style.opacity = 1;
        if (autoSpinInterval == null && autoPlayWhileOverlayActivated == false) { // If the interval is null, then the machine is not running, and if the machine is not running, the winOrLose function wont set currentlySpinning to false, so then this click should do it.
            currentlySpinning = false;
        }
    });

    prizeDisplayElement.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    gameGuideDisplayElement.addEventListener('click', (event) => {
        event.stopPropagation();
    })

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
            winOrLose();
            audioElement.pause();
            audioElement.currentTime = 0;
            autoPlayWhileOverlayActivated = false;
        }
    });

    rulle2OverflowingElement.addEventListener('transitionend', () => {
        rulle2Center = rullerArray[1][rulle2Index + 1];
        if (holdRulle3Boolean) {
            winOrLose();
            audioElement.pause();
            audioElement.currentTime = 0;
            autoPlayWhileOverlayActivated = false;
        }
    });

    rulle3OverflowingElement.addEventListener('transitionend', () => {
        rulle3HøjreTop = rullerArray[2][rulle3Index];
        rulle3HøjreCenter = rullerArray[2][rulle3Index + 1];
        rulle3HøjreBund = rullerArray[2][rulle3Index + 2];
        winOrLose();
        audioElement.pause();
        audioElement.currentTime = 0;
        autoPlayWhileOverlayActivated = false;
    });
    // EventListeners Section Ends.


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
            updateSessionDb(auth.currentUser.uid);
        }
        else {
            depositCoinBtnElement.blur();
            gameResultElement.innerHTML = "Only numbers are allowed";
            coinDepositElement.style.backgroundColor = "red";
        }
        coinDepositElement.blur();
    }

    function keyPress(e) {
        if (e.keyCode == 32 && !currentlySpinning && !coinInputFieldHasFocus) {
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
                updateSessionDb(auth.currentUser.uid);
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
                updateSessionDb(auth.currentUser.uid);
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
                updateSessionDb(auth.currentUser.uid);
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
            gameResultElement.innerHTML = "Insert more money to continue playing!";
            setTimeout(() => {
                coinDepositElement.focus();
                clearingAutoInterval();
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
            gameResultElement.innerHTML = `You hit 3 <img class="spil-resultat-image" src="assets/image/${rulle2Center.file}"> and won ${rulle1VenstreCenter.value}`;
            audioElement.play();
            audioElement.volume = 0.1;
            updateCoinAndSpinCount();
            updateLifeTimeWinDb(auth.currentUser.uid);
            updateWinningsDb(auth.currentUser.uid);

        }

        else if (rulle1VenstreTop.name === rulle2Center.name && rulle2Center.name === rulle3HøjreBund.name) {
            winCount++;
            startBtnElement.disabled = false;
            freeSpinTracker();
            gameResultElement.innerHTML = `You hit 3 <img class="spil-resultat-image" src="assets/image/${rulle2Center.file}"> Across, You get ${rulle2Center.freeSpin} free spins`;
            updateCoinAndSpinCount();
            updateLifeTimeWinDb(auth.currentUser.uid);
        }

        else if (rulle1VenstreBund.name === rulle2Center.name && rulle2Center.name === rulle3HøjreTop.name) {
            winCount++;
            startBtnElement.disabled = false;
            freeSpinTracker();
            gameResultElement.innerHTML = `You hit 3 <img class="spil-resultat-image" src="assets/image/${rulle2Center.file}"> Across, You get ${rulle2Center.freeSpin} free spins`;
            updateCoinAndSpinCount();
            updateLifeTimeWinDb(auth.currentUser.uid);
        }

        else {
            startBtnElement.disabled = false;
            gameResultElement.innerHTML = "You lost, try again!";
            updateLifeTimeGameDb(auth.currentUser.uid);
        }
        // if (gameCount / winCount != Infinity) {
        //     // winRateDisplayElement.innerHTML = `Win-rate: ${((winCount / gameCount) * 100).toFixed(1)}%`;
        // }
        // // gameCountDisplayElement.innerHTML = `T: ${gameCount} | L: ${(gameCount - winCount)} | W: ${winCount}`;

        currentlySpinning = false;
        updateSessionDb(auth.currentUser.uid);
    }

    function updateSessionDb(userUid) {
        db.collection('users').doc(userUid).update({
            coin: coins,
            freespin: freeSpinCount,
            sessionGames: gameCount,
            sessionWins: winCount
        });
    }

    function updateWinningsDb(userUid) {
        db.collection('users').doc(userUid).get()
            .then((userData) => {
                db.collection('users').doc(userUid).update({
                    sessionWinnings: (userData.data().sessionWinnings != undefined ? userData.data().sessionWinnings + rulle2Center.value : rulle2Center.value),
                    lifeTimeWinnings: (userData.data().lifeTimeWinnings != undefined ? userData.data().lifeTimeWinnings + rulle2Center.value : rulle2Center.value)
                })

            })
    }

    function updateLifeTimeWinDb(userUid) {
        // console.log(rulle2Center.value);
        db.collection('users').doc(userUid).get()
            .then((userData) => {
                db.collection('users').doc(userUid).update({
                    lifeTimeWins: userData.data().lifeTimeWins + 1,
                    lifeTimeGames: userData.data().lifeTimeGames + 1,
                });
            })
    }

    function updateLifeTimeGameDb(userUid) {
        db.collection('users').doc(userUid).get()
            .then((userData) => {
                db.collection('users').doc(userUid).update({
                    lifeTimeGames: userData.data().lifeTimeGames + 1
                });
            })
    }

    function freeSpinTracker() {
        freeSpinCount += rulle2Center.freeSpin;
    }

    function clearingAutoInterval() {
        clearInterval(autoSpinInterval);
        autoSpinActive = false;
        autoBtnElement.innerHTML = "Auto Play";
        autoSpinInterval = null;
    }

    function closingCode() {
        db.collection('users').doc(auth.currentUser.uid).update({
            sessionGames: 0,
            sessionWins: 0,
            sessionWinnings: 0,
            isOnline: false,
        })
    }


    function sortScoreboard() {
        let switching, i, x, y, shouldSwitch;
        switching = true;
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;

            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 0; i < (scoreboardTableElement.rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = parseInt(scoreboardTableElement.rows[i].children[4].textContent);
                y = parseInt(scoreboardTableElement.rows[i + 1].children[4].textContent);
                // Check if the two rows should switch place:
                if (x < y) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                scoreboardTableElement.rows[i].parentNode.insertBefore(scoreboardTableElement.rows[i + 1], scoreboardTableElement.rows[i]);
                switching = true;
            }
        }
        if (auth.currentUser != null) {
            let colorCurrentUserOnScoreboard = scoreboardTableElement.querySelector(`[data-tr-id=${auth.currentUser.uid}]`);

            colorCurrentUserOnScoreboard.classList.add('color-user-on-scoreboard');
        }
    }
    
    function sortMessageArray(messagedocs) {
        messagedocs.sort((a, b) => (a.doc.data().postTime > b.doc.data().postTime) ? 1 : -1)
        messagedocs.forEach(data => {
            renderChatMessage(data);
        });
        newMessage = true;
    }
    
    function renderChatMessage(data) {
        let clone = chatMessageTemplateElem.cloneNode(true);
        
        clone.setAttribute("data-id", data.doc.id);
        clone.querySelector(".chat-message__message").textContent = data.doc.data().message;
        
        let postDate = new Date(data.doc.data().postTime);
        let postHour = postDate.getHours();
        if (postHour < 10) {
            postHour = `0${postHour}`;
        }
        let postMinute = postDate.getMinutes();
        if (postMinute < 10) {
            postMinute = `0${postMinute}`;
        }
        
        let removeBtn = clone.querySelector(".chat-message__removebtn");
        if (data.userDoc.id == auth.currentUser.uid) {
            removeBtn.addEventListener("click", () => {
                db.collection("chat").doc(data.doc.id).delete()
            })
        } else {
            removeBtn.remove();
        }
        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let currentDate = new Date();
        let messageTime = "";
        
        if (postDate.getDate() == currentDate.getDate()) {
            if (postDate.getMonth() == currentDate.getMonth()) {
                if (postDate.getFullYear() == currentDate.getFullYear()) {
                    messageTime = `(${postHour}:${postMinute})`;
                } else {
                    messageTime = `(${months[postDate.getMonth()]} ${postDate.getDate()} ${postDate.getFullYear()}.  ${postHour}:${postMinute})`;
                }
            } else {
                messageTime = `(${months[postDate.getMonth()]} ${postDate.getDate()}.  ${postHour}:${postMinute})`;
            }
        } else {
            if (postDate.getDate() < currentDate.getDate() - 7) {
                
                messageTime = `(${days[postDate.getDay()]}, ${postHour}:${postMinute})`;
            } else {
                messageTime = `(${days[postDate.getDay()]} ${postDate.getDate()}, ${postHour}:${postMinute})`;
            }
        }
        
        clone.querySelector(".chat-message__timesent").textContent = messageTime;
        
        if (data.userDoc.data() != undefined) {
            if (data.userDoc.data().imagePath != null) {
                clone.querySelector(".chat-message__userimg").src = data.userDoc.data().imagePath;
            }
            clone.querySelector(".chat-message__author").textContent = data.userDoc.data().fullname;
            chatMessageContainerElem.appendChild(clone);
            let messages = chatMessageContainerElem.querySelectorAll(".chat-message");
            
            if (messages[messages.length - 1].offsetTop - chatMessageContainerElem.scrollTop < 800) {
                chatMessageContainerElem.scrollTop = messages[messages.length - 1].offsetTop;
            }
        } else {
            db.collection("chat").doc(data.doc.id).delete()
        }
        if (newMessage == true) {
            let message = data.doc.data().message.toLowerCase();
            if (data.doc.data().message.includes(`@${userinfo.fullname.toLowerCase()}`)) {
                sendNotification(data.userDoc.data().imagePath, data.doc.data().message, data.userDoc.data().fullname);
            }
        }
    }
    
    function sendNotification(userImg, msg, name) {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (!document.hasFocus()) {
                if (permission === "granted") {
                    var notification = new Notification(
                        "New Message!",
                        {
                            "body": `${name}: ${msg}`,
                            "icon": userImg,
                            "vibrate": [200, 100, 200, 100, 200, 100, 400],
                            "tag": "request",
                        }
                        );
                    }
                }
            })
        }
        
        
        function updateInputSelection() {
            inputStart = chatFormElem.chatFormMessage.selectionStart;
            inputEnd = chatFormElem.chatFormMessage.selectionEnd;
        }
        
        
        // Function Definition Section Ends.
        
        
        
    }());
    
