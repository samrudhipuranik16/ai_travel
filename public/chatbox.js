function openChat() {
  document.getElementById("chat-icon").style.display = "none";  // hide the small icon
  document.getElementById("chatbox").style.display = "flex";   // show chatbox
}

function closeChat() {
  document.getElementById("chatbox").style.display = "none";   // hide chatbox
  document.getElementById("chat-icon").style.display = "flex"; // show the small icon again
}

function sendMessage(e) {
  if (e.key === "Enter") {
    const input = e.target;
    const msg = input.value.trim();
    if (msg) {
      const messages = document.querySelector(".chat-messages");
      
      // user message
      const userMsg = document.createElement("div");
      userMsg.textContent = "You: " + msg;
      messages.appendChild(userMsg);

      // bot reply
      const botMsg = document.createElement("div");
      botMsg.textContent = "Bot: Thanks! We'll help you plan.";
      messages.appendChild(botMsg);

      input.value = "";
      messages.scrollTop = messages.scrollHeight;
    }
  }
}
