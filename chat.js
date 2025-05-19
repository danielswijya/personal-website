const chatInput = document.getElementById("chat-input");
const chatWindow = document.getElementById("chat-window");

chatInput.addEventListener("keypress", async function (e) {
  if (e.key === "Enter") {
    const userInput = chatInput.value.trim();
    if (!userInput) return;

    chatWindow.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
    chatInput.value = "";

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userInput })
      });

      const data = await res.json();
      chatWindow.innerHTML += `<p><strong>Daniel:</strong> ${data.reply}</p>`;
      chatWindow.scrollTop = chatWindow.scrollHeight;
    } catch (err) {
      console.error(err);
      chatWindow.innerHTML += `<p style="color:red;"><strong>Error:</strong> Could not fetch response.</p>`;
    }
  }
});
