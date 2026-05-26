// --- BACKGROUND GENERATION ---
const particlesContainer = document.getElementById("particles-container");
const chars = ["λ", "T", "♡", "0", "1", "Σ", "{", "}", "7", "</>", "∞", "π"];
const colors = ["#ffffff", "#ffb3c1", "#8eecf5", "rgba(255,255,255,0.4)"];

for (let i = 0; i < 45; i++) {
  let p = document.createElement("div");
  p.className = "particle";
  p.innerText = chars[Math.floor(Math.random() * chars.length)];
  p.style.left = `${Math.random() * 100}vw`;
  p.style.color = colors[Math.floor(Math.random() * colors.length)];
  p.style.fontSize = `${Math.random() * 14 + 12}px`;
  p.style.animationDuration = `${Math.random() * 20 + 15}s`;
  p.style.animationDelay = `-${Math.random() * 35}s`;
  particlesContainer.appendChild(p);
}

function generateDNA(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < 7; i++) {
    const bar = document.createElement("div");
    bar.className = "dna-bar";
    bar.style.animationDelay = `-${i * 0.3}s`;
    container.appendChild(bar);
  }
}
generateDNA("dna-1");
generateDNA("dna-2");
generateDNA("dna-3");
generateDNA("dna-4");

// --- DOM ELEMENTS ---
const btn = document.getElementById("enter-btn");
const input = document.getElementById("name-input");
const box1 = document.getElementById("box-1");
const box2 = document.getElementById("box-2");
const box3 = document.getElementById("box-3");
const msgTarget = document.getElementById("msg-target");
const errorMsg = document.getElementById("error-msg");
const chatContainer = document.getElementById("chat-container");

// --- HELPERS ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function typeWriter(element, text, speed = 40) {
  element.innerHTML = "";
  for (let char of text) {
    element.innerHTML += char;
    await sleep(speed + Math.random() * 30);
  }
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function appendMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerText = text;
  chatContainer.appendChild(bubble);
  scrollToBottom();
}

let activeActionNode = null;

async function setChatButtons(buttons) {
  if (activeActionNode) {
    activeActionNode.remove();
    activeActionNode = null;
  }

  if (!buttons || buttons.length === 0) return;

  const container = document.createElement("div");
  container.className = "inline-actions";

  buttons.forEach((btnConfig) => {
    const button = document.createElement("button");
    button.className = `chat-btn ${btnConfig.type || "primary"}`;
    button.id = btnConfig.id;
    button.innerText = btnConfig.text;

    button.addEventListener(
      "click",
      btnConfig.handler || (() => console.log("clicked")),
    );
    container.appendChild(button);
  });

  chatContainer.appendChild(container);
  activeActionNode = container;
  scrollToBottom();
}

async function sendDecisionSequence(userChoice, aiReplyText, speed = 800) {
  setChatButtons(null);
  await appendMessage("user", userChoice);
  await sleep(speed);
  await appendMessage("ai", aiReplyText);
}

// --- SEQUENCE LOGIC ---
function startSequence() {
  const rawName = input.value.trim();
  const name = rawName.toLowerCase();

  const allowedNames = [
    "jules",
    "juliana",
    "nicole",
    "duya",
    "juliana nicole",
    "juliana nicole duya",
  ];

  if (!allowedNames.includes(name)) {
    errorMsg.classList.add("show");
    input.classList.add("error");
    return;
  }

  errorMsg.classList.remove("show");
  input.classList.remove("error");

  box1.classList.remove("pop-in");
  box1.classList.add("pop-out");

  setTimeout(async () => {
    box1.classList.remove("active");
    box2.classList.add("active", "pop-in");
    await sleep(800);

    await typeWriter(
      msgTarget,
      `Identity verified. Establishing secure connection...`,
    );
    await sleep(1500);

    box2.classList.remove("pop-in");
    box2.classList.add("pop-out");

    setTimeout(async () => {
      box2.classList.remove("active");
      box3.classList.add("active", "pop-in");
      await sleep(800);

      // SHORT INTRODUCTION BEFORE THE JOKE
      await appendMessage("ai", `Hey ${rawName}!`);
      await sleep(1500);
      await appendMessage("ai", "I've been meaning to ask you something...");
      await sleep(1800);
      await appendMessage("ai", "But honestly, I got a bit shy 😅");
      await sleep(1800);
      await appendMessage("ai", "btw I have a joke");
      await sleep(1200);

      // THE JOKE
      await appendMessage("ai", "Knock knock");

      setChatButtons([
        {
          id: "btn-whos-there",
          text: "Who's there?",
          type: "primary",
          handler: async () => {
            setChatButtons(null);
            await appendMessage("user", "Who's there?");
            await sleep(800);

            await appendMessage("ai", "What When");
            setChatButtons([
              {
                id: "btn-what-when",
                text: "What when who?",
                type: "primary",
                handler: async () => {
                  setChatButtons(null);
                  await appendMessage("user", "What When Who?");
                  await sleep(800);

                  await appendMessage("ai", "Running, Tomorrow, Yow & Me.");
                  await sleep(500);

                  setChatButtons([
                    {
                      id: "btn-accept",
                      text: "Accept ♥",
                      type: "primary",
                      handler: () =>
                        sendDecisionSequence(
                          "Accept ♥",
                          "Yay! See you then 😊",
                        ),
                    },
                    {
                      id: "btn-decline",
                      text: "Decline",
                      type: "secondary",
                      handler: () =>
                        sendDecisionSequence(
                          "Decline",
                          "Ah, no worries. Thanks anyway!",
                        ),
                    },
                  ]);
                },
              },
            ]);
          },
        },
      ]);
    }, 400);
  }, 400);
}

// --- EVENT LISTENERS ---
btn.addEventListener("click", startSequence);
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") startSequence();
});

input.addEventListener("input", () => {
  errorMsg.classList.remove("show");
  input.classList.remove("error");
});
