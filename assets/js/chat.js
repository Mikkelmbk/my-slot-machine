let chatElem = document.querySelector(".chat");
let chatFormElem = document.querySelector('.chat-form');
let chatMessageContainerElem = document.querySelector('.chat-messagecontainer');
let chatMessageTemplateElem = document.querySelector('.html-templates .chat-message');



auth.onAuthStateChanged((user) => {
    if (user == null) {
        chatFormElem.chatFormMessage.disabled = true
        chatFormElem.chatFormButton.disabled = true
        chatFormElem.chatFormMessage.placeholder = "Please login to type in the chat"
    } else {
        chatFormElem.chatFormMessage.disabled = false
        chatFormElem.chatFormButton.disabled = false
        chatFormElem.chatFormMessage.placeholder = "Message..."

        db.collection("chat").orderBy("postTime", "asc").onSnapshot(snapshot => {
            let orderedDocs = []
            changes = snapshot.docChanges()
            changes.forEach((change) => {
                if (change.type == "added") {
                    // renderChatMessage(change.doc)
                    db.collection("users").doc(change.doc.data().author).get().then((userDoc) => {
                        orderedDocs.push({doc: change.doc,userDoc: userDoc,})
                        if(orderedDocs.length == changes.length){
                            dostuff(orderedDocs)
                        }
                    })
                } else if (change.type == "removed") {
                    chatElem.querySelector(`[data-id='${change.doc.id}']`).remove()
                }
            });
        })
    }
})

function dostuff(dataArray){
    dataArray.sort((a, b) => (a.doc.data().postTime > b.doc.data().postTime) ? 1 : -1)
    dataArray.forEach(data => {
        renderChatMessage(data)
    });
}

function renderChatMessage(data) {
    let clone = chatMessageTemplateElem.cloneNode(true)

    clone.setAttribute("data-id", data.doc.id)
    clone.querySelector(".chat-message__message").textContent = data.doc.data().message;

    let postDate = new Date(data.doc.data().postTime);
    let postHour = postDate.getHours()
    if (postHour < 10) {
        postHour = `0${postHour}`
    }
    let postMinute = postDate.getMinutes()
    if (postMinute < 10) {
        postMinute = `0${postMinute}`
    }
    clone.querySelector(".chat-message__timesent").textContent = `(${postHour}:${postMinute})`;

    if (data.userDoc.data() != undefined) {
        if (data.userDoc.data().imagePath != null) {
            clone.querySelector(".chat-message__userimg").src = data.userDoc.data().imagePath;
        }
        clone.querySelector(".chat-message__author").textContent = data.userDoc.data().fullname;
        chatMessageContainerElem.appendChild(clone);
        let messages = chatMessageContainerElem.querySelectorAll(".chat-message")
        chatMessageContainerElem.scrollTop = messages[messages.length - 1].offsetTop
    } else {
        db.collection("chat").doc(data.doc.id).delete()
    }
}

chatFormElem.addEventListener("submit", (event) => {
    event.preventDefault()
    let date = new Date()
    if (auth.currentUser != null) {
        if (chatFormElem.chatFormMessage.value != "") {
            db.collection("chat").add({
                postTime: date.getTime(),
                author: auth.currentUser.uid,
                message: chatFormElem.chatFormMessage.value
            })
        }
    }
    chatFormElem.reset()
})
let emojiContainer = document.querySelector(".emojipopup-emojicontainer")
let chatFormEmojiBtnElem = chatFormElem.querySelector(".chat-form__emoji-button")
let chatFormInputElem = chatFormElem.querySelector(".chatFormMessage")
let inputStart, inputEnd
let inputfocused = false;

chatFormInputElem.addEventListener("keyup", () => {
    updateInputSelection()
})
chatFormInputElem.addEventListener("mouseup", () => {
    updateInputSelection()
})

function updateInputSelection() {
    inputStart = chatFormElem.chatFormMessage.selectionStart;
    inputEnd = chatFormElem.chatFormMessage.selectionEnd;
}

emojiContainer.addEventListener("mouseleave",()=>{
    chatFormElem.emojispopupcheckbox.checked = false;
})

emojiContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("emojipopup-emoji")) {
        const value = chatFormElem.chatFormMessage.value;

        if (inputStart == undefined || inputStart == 0 && inputEnd == 0 || inputEnd == undefined) {
            chatFormElem.chatFormMessage.value += event.target.textContent;
            inputStart = inputEnd = 2
        } else {
            chatFormElem.chatFormMessage.value = value.slice(0, inputStart) + event.target.textContent + value.slice(inputEnd);
        }

        // update cursor to be at the end of insertion
        chatFormElem.chatFormMessage.selectionStart = chatFormElem.chatFormMessage.selectionEnd = inputStart = inputEnd = inputStart + event.target.textContent.length;
        chatFormInputElem.focus()
    }
})


let emojiRange = [
    [128512, 128591], [9986, 10160], [128640, 128704]
];

for (var i = 0; i < emojiRange.length; i++) {
    let range = emojiRange[i];
    for (var x = range[0]; x < range[1]; x++) {
        let emoji = document.createElement('span');
        emoji.innerHTML = "&#" + x + ";";
        emoji.classList.add("emojipopup-emoji")
        emojiContainer.appendChild(emoji);
    }
}


function insertAtCursor(input, textToInsert) {
    // get current text of the input
    const value = input.value;

    // save selection start and end position
    const start = input.selectionStart;
    const end = input.selectionEnd;

    // update the value with our text inserted
    input.value = value.slice(0, start) + textToInsert + value.slice(end);

    // update cursor to be at the end of insertion
    input.selectionStart = input.selectionEnd = start + textToInsert.length;
}