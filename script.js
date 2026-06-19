const screens = {
  products: {
    src: "./assets/products-ai-tab.png",
    alt: "Products screen",
  },
  error: {
    src: "./assets/error-code-ai-tab.png",
    alt: "Error Code screen",
  },
  tools: {
    src: "./assets/tools-ai-tab.png",
    alt: "Tools screen",
  },
  bookmarks: {
    src: "./assets/bookmarks-ai-tab.png",
    alt: "Bookmarks screen",
  },
  airus: {
    src: "./assets/airus-ai-module-screen.png",
    alt: "Daikin Technical Assistant screen",
  },
};

const cannedReplies = {
  "Error code 01": {
    title: "Error code 01",
    summary:
      "Error code 01 is commonly associated with a low-side fault. Start by confirming the product family and operating conditions before resetting the system.",
    points: [
      "Check the matching unit type and control category.",
      "Review low-pressure conditions and refrigerant-side symptoms.",
      "Verify control wiring and recent service changes before clearing the fault.",
    ],
  },
  "What is a VRV system?": {
    title: "VRV system overview",
    summary:
      "A VRV system, or Variable Refrigerant Volume system, is a multi-split HVAC system that varies refrigerant flow to serve multiple indoor zones from connected outdoor equipment.",
    points: [
      "Inverter-driven compressors vary capacity instead of simply turning fully on or off.",
      "Indoor units can condition separate zones based on local demand.",
      "Electronic expansion valves help regulate refrigerant flow at each indoor unit.",
      "This design improves comfort and efficiency in larger or multi-zone buildings.",
    ],
  },
  "Find a manual": {
    title: "Find a manual",
    summary:
      "Use the model number from the equipment label to locate the correct installation, service, or submittal document.",
    points: [
      "Confirm the full model number, including suffixes.",
      "Choose the document type needed for the task.",
      "If the unit has matched indoor and outdoor models, check both references.",
    ],
  },
  "Parts lookup": {
    title: "Parts lookup",
    summary:
      "Parts lookup works best when the model number, serial range, and part description are available together.",
    points: [
      "Start with the exact model number from the data plate.",
      "Use the part name or function to narrow the category.",
      "Confirm compatibility before ordering or replacing components.",
    ],
  },
};

const screenImage = document.querySelector("#screen");
const nativeAirus = document.querySelector("#native-airus");
const conversation = document.querySelector("#conversation");
const queryText = document.querySelector("#query-text");
const answerTitle = document.querySelector("#answer-title");
const answerSummary = document.querySelector("#answer-summary");
const answerList = document.querySelector("#answer-list");
const sourcesToggle = document.querySelector("#sources-toggle");
const sourcesPanel = document.querySelector("#sources-panel");
const sourceViewer = document.querySelector("#source-viewer");
const viewerBack = document.querySelector("#viewer-back");
const viewerTitle = document.querySelector("#viewer-title");
const input = document.querySelector("#airus-input");
const cameraButton = document.querySelector(".camera-button");
const voiceButton = document.querySelector(".voice-button");
const voiceStatus = document.querySelector("#voice-status");

function showScreen(name) {
  const screen = screens[name] || screens.products;
  screenImage.src = screen.src;
  screenImage.alt = screen.alt;
  const isAirus = name === "airus";
  nativeAirus.hidden = !isAirus;
  screenImage.hidden = isAirus;
  if (name !== "airus") {
    conversation.hidden = true;
    sourceViewer.hidden = true;
    input.value = "";
    screenImage.hidden = false;
  }
}

function showReply(message) {
  const trimmed = message.trim();
  if (!trimmed) return;

  const normalized = trimmed.toLowerCase();
  const responseKey =
    cannedReplies[trimmed] ||
    (normalized.includes("vrv") ? cannedReplies["What is a VRV system?"] : null) ||
    (normalized.includes("error") && normalized.includes("01") ? cannedReplies["Error code 01"] : null);

  const response =
    responseKey || {
      title: "Service guidance",
      summary: `I can help with "${trimmed}". Share the model number, error code, symptom, or current operating condition and I’ll guide the next step.`,
      points: [
        "Provide the model number when available.",
        "Include any active error code or symptom.",
        "Mention recent service work or environmental conditions.",
      ],
    };

  queryText.textContent = trimmed;
  answerTitle.textContent = response.title;
  answerSummary.textContent = response.summary;
  answerList.replaceChildren(
    ...response.points.map((point) => {
      const item = document.createElement("li");
      item.textContent = point;
      return item;
    }),
  );
  conversation.hidden = false;
  sourcesPanel.hidden = true;
  sourceViewer.hidden = true;
  sourcesToggle.setAttribute("aria-expanded", "false");
  conversation.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

document.querySelectorAll("[data-screen]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.screen);
    button.blur();
  });
});

document.querySelectorAll("[data-message]").forEach((button) => {
  button.addEventListener("click", () => showReply(button.dataset.message));
});

document.querySelectorAll(".response-actions button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".response-actions button")
      .forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
  });
});

voiceButton.addEventListener("click", () => {
  const isListening = voiceButton.classList.toggle("listening");
  voiceStatus.hidden = !isListening;
  input.placeholder = isListening ? "Listening..." : "Ask anything";
});

cameraButton.addEventListener("click", () => {
  input.value = "Photo attached";
  input.focus();
});

sourcesToggle.addEventListener("click", () => {
  const isOpen = !sourcesPanel.hidden;
  sourcesPanel.hidden = isOpen;
  sourcesToggle.setAttribute("aria-expanded", String(!isOpen));
});

document.querySelectorAll(".sources-panel button").forEach((button) => {
  button.addEventListener("click", () => {
    const sourceName = button.querySelector("span").textContent;
    viewerTitle.textContent = sourceName;
    sourceViewer.hidden = false;
    sourcesPanel.hidden = true;
    sourcesToggle.setAttribute("aria-expanded", "false");
  });
});

viewerBack.addEventListener("click", () => {
  sourceViewer.hidden = true;
});

document.querySelector("#airus-form").addEventListener("submit", (event) => {
  event.preventDefault();
  showReply(input.value);
  input.blur();
});
