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

        db.collection("chat").orderBy("postDate").onSnapshot(snapshot =>{
            changes = snapshot.docChanges()
            changes.forEach(change => {
                if(change.type == "added"){
                    renderChatMessage(change.doc)
                }else if(change.type == "removed"){
                    chatElem.querySelector(`[data-id='${change.doc.id}']`).remove()
                }
            });
        })
    }
})

function renderChatMessage(doc){

    let clone = chatMessageTemplateElem.cloneNode(true)

    clone.setAttribute("data-id", doc.id)
    clone.querySelector(".chat-message__message").textContent = doc.data().message;

    let postDate = doc.data().postDate.toDate();
    let postHour = postDate.getHours()
    if(postHour < 10){
        postHour = `0${postHour}`
    }
    let postMinute = postDate.getMinutes()
    if(postMinute < 10){
        postMinute = `0${postMinute}`
    }
    clone.querySelector(".chat-message__timesent").textContent = `(${postHour}:${postMinute})`;

    db.collection("users").doc(doc.data().author).get().then((userDoc)=>{
        if(userDoc.data() != undefined){
            if(userDoc.data().picture != null){
                clone.querySelector(".chat-message__userimg").src = userDoc.data().picture;
            }
            clone.querySelector(".chat-message__author").textContent = userDoc.data().fullname;
            chatMessageContainerElem.appendChild(clone);
            let messages = chatMessageContainerElem.querySelectorAll(".chat-message")
            chatMessageContainerElem.scrollTop = messages[messages.length - 1].offsetTop
        }else{
            db.collection("chat").doc(doc.id).delete()
        }
    })
}

chatFormElem.addEventListener("submit", (event) => {
    event.preventDefault()

    if (auth.currentUser != null) {
        if (chatFormElem.chatFormMessage.value != "") {
            db.collection("chat").add({
                postDate: new Date(),
                author: auth.currentUser.uid,
                message: chatFormElem.chatFormMessage.value
            })
        }
    }
    chatFormElem.reset()
})