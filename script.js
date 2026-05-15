const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");



sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function addMessage(text, className) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", className);

    // avatar
    const avatar = document.createElement("div");

    avatar.classList.add("avatar");

    avatar.innerText =
    className === "user-message" ? "🧑" : "🤖";

    // text
    const msgText = document.createElement("div");

    msgText.classList.add("msg-text");

    msgText.innerText = text;

    // append
    messageDiv.appendChild(avatar);

    messageDiv.appendChild(msgText);

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}
    //chatBox.scrollTop = chatBox.scrollHeight;
async function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    // GROQ API 
    const GROQ_API_KEY = "api"; 

    addMessage(userText, "user-message");
    userInput.value = "";

    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.innerText = "Typing...";
    chatBox.appendChild(typingDiv);

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Llama 3 model 
                model: "llama-3.3-70b-versatile", 
                messages: [
                    {
                        role: "user",
                        content: userText
                    }
                ]
            })
        });

        const data = await response.json();
        typingDiv.remove();

        if (data.choices && data.choices.length > 0) {
            const botReply = data.choices[0].message.content;
            addMessage(botReply, "bot-message");
        } else {
            addMessage("Response nahi mila, please check API Key.", "bot-message");
        }

    } catch (error) {
        typingDiv.remove();
        addMessage("Connection error!", "bot-message");
        console.error(error);
    }
}

const themeToggle = document.getElementById("themeToggle");

// Toggle theme
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");
});

const input = document.getElementById("userInput");

input.addEventListener("focus", () => {

    // excited animation
    console.log("Character excited");

});

// ================= VOICE INPUT =================

const voiceBtn = document.getElementById("voiceBtn");

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";

voiceBtn.addEventListener("click", () => {

    recognition.start();

});

recognition.onresult = function(event) {

    const text = event.results[0][0].transcript;

    userInput.value = text;

};

recognition.onerror = function(event){

    console.log(event.error);

};