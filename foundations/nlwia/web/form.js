import { server } from "./server.js";

const form = document.querySelector("#form");
const input = document.querySelector("#url");
const content = document.querySelector("#content");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  content.classList.add("placeholder");

  const videoURL = input.value;

  if (!videoURL) {
    return (content.textContent = "Please provide a URL");
  }

  if (!videoURL.includes("shorts")) {
    return (content.textContent = "Not a YouTube Shorts URL");
  }

  const [_, params] = videoURL.split("/shorts/");
  const [videoId] = params.split("?si");

  content.textContent = "AI is working on video...";

  const transcription = await server.get("/summary/" + videoId);

  content.textContent = "AI is working on summary...";

  const summary = await server.post("/summary", {
    text: transcription.data.result,
  });

  content.textContent = summary.data.result;

  content.classList.remove("placeholder");
});
