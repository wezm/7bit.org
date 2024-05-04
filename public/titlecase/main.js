import init, { titlecase } from "./titlecase.js";

async function run() {
  await init();
}

async function processText(event, details, error) {
  event.preventDefault();
  details.classList.add("hidden");
  error.classList.add("hidden");

  try {
    const text = document.forms[0].inputtext.value;
    const out = details.querySelector(".result-text");
    const res = titlecase(text);
    out.textContent = res;

    details.classList.remove("hidden");
  } catch (e) {
    error.classList.remove("hidden");
    if (typeof e === "string") {
      error.querySelector("p").textContent = e;
    } else {
      error.querySelector("p").textContent = e.message;
    }
  }
}

document.addEventListener("DOMContentLoaded", async (event) => {
  const details = document.getElementById("result");
  const error = document.getElementById("error");

  if ("clipboard" in navigator) {
    const copyButton = details.querySelector(".copy-text");
    copyButton.classList.remove("hidden");
    copyButton.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const text = details.querySelector(".result-text");
        copyButton.disabled = true;
        await navigator.clipboard.writeText(text.textContent);
        copyButton.disabled = false;
        copyButton.textContent = "Copied!";
        setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 1000);
      } catch (err) {
        error.classList.remove("hidden");
        if (typeof err === "string") {
          error.querySelector("p").textContent = err;
        } else {
          error.querySelector("p").textContent = err.message;
        }
      }
    });
  }

  document.forms[0].addEventListener("submit", async (e) =>
    processText(e, details, error),
  );

  run()
    .then(() => {
      document.forms[0].go.disabled = false;
    })
    .catch(() => {
      error.classList.remove("hidden");
      error.querySelector("p").textContent =
        "Unable to initialise WASM module.";
    });
});
