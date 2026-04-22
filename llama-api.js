/*
 * Made by ghgltggamer 2026
 * Written by ghgltggamer with the help of AI
 * Licensed under the CC0 License
 * Checkout the README.md file for more information
 */


let SERVER_URL = "http://localhost:8080/v1/chat/completions";
let MODEL_URL = "http://localhost:8080/v1/models";

let activeController = null;

/**
 * Set server base URL
 */
function setServerUrl(baseUrl) {
  SERVER_URL = new URL("/v1/chat/completions", baseUrl).toString();
  MODEL_URL = new URL("/v1/models", baseUrl).toString();
}


// Streaming response
function get_response(body, element) {
  // 🛑 stop any previous request automatically
  if (activeController) {
    activeController.abort();
  }

  const controller = new AbortController();
  activeController = controller;

  element.textContent = "";

  (async () => {
    const decoder = new TextDecoder("utf-8");

    try {
      const res = await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          stream: true,
          ...body,
        }),
      });

      if (!res.ok || !res.body) {
        element.textContent = "❌ Request failed";
        return;
      }

      const reader = res.body.getReader();

      let buffer = "";
    let renderTimeout = null;
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
    
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
    
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
    
        const data = line.slice(6).trim();
    
        if (data === "[DONE]") continue;
    
        try {
          const json = JSON.parse(data);
          const text = json?.choices?.[0]?.delta?.content;
        
          if (!text) continue;
        
          // 🧠 accumulate stream
          buffer += text;
        
          // ⚡ immediate fallback (smooth UX)
          element.textContent = buffer;
        
          // 🎨 debounce markdown rendering
          clearTimeout(renderTimeout);
          renderTimeout = setTimeout(() => {
            if (window.marked) {
              element.innerHTML = marked.parse(buffer);
            } else {
              element.textContent = buffer;
            }
          }, 60);
        
        } catch (e) {
          // ignore malformed chunks safely
        }
      }
    }

      // flush decoder (important edge-case fix)
      element.append(document.createTextNode(decoder.decode()));

    } catch (err) {
      if (err.name === "AbortError") {
        console.log("🛑 Generation stopped");
      } else {
        console.error(err);
        element.textContent = "❌ Error during generation";
      }
    } finally {
      activeController = null;
    }
  })();

  return controller;
}



// Stop
function stop_generation() {
  if (!activeController) return;

  activeController.abort();
  activeController = null;
}




// List models
async function get_models() {
  try {
    const res = await fetch(MODEL_URL);

    if (!res.ok) {
      throw new Error(`Failed to fetch models: ${res.status}`);
    }

    const data = await res.json();

    return data?.data ?? data ?? [];
  } catch (err) {
    console.error("Model fetch error:", err);
    return [];
  }
}
