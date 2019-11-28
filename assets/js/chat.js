let chatElem = document.querySelector(".chat");
let chatFormElem = document.querySelector('.chat-form');
let chatMessageContainerElem = document.querySelector('.chat-messagecontainer');
let chatMessageTemplateElem = document.querySelector('.html-templates .chat-message');

let newMessage = false
let userinfo

auth.onAuthStateChanged((user) => {
    if (user == null) {
        chatFormElem.chatFormMessage.disabled = true
        chatFormElem.chatFormButton.disabled = true
        chatFormElem.chatFormMessage.placeholder = "Please login to type in the chat"
    } else {
        chatFormElem.chatFormMessage.disabled = false
        chatFormElem.chatFormButton.disabled = false
        chatFormElem.chatFormMessage.placeholder = "Message..."
        db.collection("users").doc(user.uid).get().then((currentUserDoc) => {
            userinfo = currentUserDoc.data();
            db.collection("chat").orderBy("postTime", "desc").onSnapshot(snapshot => {
                let messagedocs = []
                changes = snapshot.docChanges()
                changes.forEach((change) => {
                    if (change.type == "added") {

                        db.collection("users").doc(change.doc.data().author).get().then((userDoc) => {
                            messagedocs.push({ doc: change.doc, userDoc: userDoc, })
                            if (messagedocs.length == changes.length) {
                                sortMessageArray(messagedocs)
                            }
                        })
                    } else if (change.type == "removed") {
                        chatElem.querySelector(`[data-id='${change.doc.id}']`).remove()
                    }
                });
            })
        })
    }
})

function sortMessageArray(messagedocs) {
    messagedocs.sort((a, b) => (a.doc.data().postTime > b.doc.data().postTime) ? 1 : -1)
    messagedocs.forEach(data => {
        renderChatMessage(data)
    });
    newMessage = true
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

    let removeBtn = clone.querySelector(".chat-message__removebtn");
    if (data.userDoc.id == auth.currentUser.uid) {
        removeBtn.addEventListener("click", () => {
            db.collection("chat").doc(data.doc.id).delete()
        })
    } else {
        removeBtn.remove()
    }
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let currentDate = new Date()
    let messageTime = "";

    if (postDate.getDate() == currentDate.getDate()) {
        if (postDate.getMonth() == currentDate.getMonth()) {
            if (postDate.getFullYear() == currentDate.getFullYear()) {
                messageTime = `(${postHour}:${postMinute})`
            } else {
                messageTime = `(${months[postDate.getMonth()]} ${postDate.getDate()} ${postDate.getFullYear()}.  ${postHour}:${postMinute})`
            }
        } else {
            messageTime = `(${months[postDate.getMonth()]} ${postDate.getDate()}.  ${postHour}:${postMinute})`
        }
    } else {
        messageTime = `(${days[postDate.getDay()]}, ${postHour}:${postMinute})`
    }

    clone.querySelector(".chat-message__timesent").textContent = messageTime;

    if (data.userDoc.data() != undefined) {
        if (data.userDoc.data().imagePath != null) {
            clone.querySelector(".chat-message__userimg").src = data.userDoc.data().imagePath;
        }
        clone.querySelector(".chat-message__author").textContent = data.userDoc.data().fullname;
        chatMessageContainerElem.appendChild(clone);
        let messages = chatMessageContainerElem.querySelectorAll(".chat-message")

        if (messages[messages.length - 1].offsetTop - chatMessageContainerElem.scrollTop < 800) {
            chatMessageContainerElem.scrollTop = messages[messages.length - 1].offsetTop
        }
    } else {
        db.collection("chat").doc(data.doc.id).delete()
    }
    if (newMessage == true) {
        let message = data.doc.data().message.toLowerCase()
        if(data.doc.data().message.includes(`@${userinfo.fullname.toLowerCase()}`)){   
            sendNotification(data.userDoc.data().imagePath, data.doc.data().message, data.userDoc.data().fullname)
        }
    }
}

function sendNotification(userImg, msg, name) {
    Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
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
    })
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


//Emoji's :D
let emojiContainer = document.querySelector(".emojipopup-emojicontainer");
let emojiPopUpElem = document.querySelector(".emojipopup");

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



emojiPopUpElem.addEventListener("mouseleave", (event) => {
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
// Emoji end