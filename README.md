# llama-api.js ⚡

A lightweight JavaScript wrapper for interacting with OpenAI-compatible servers like **llama.cpp server**, supporting **streaming chat responses**, automatic request cancellation, and model listing.

Built by *ghgltggamer (2026)* with AI assistance.

---

## 🚀 Features

- ⚡ Streaming chat completions (token-by-token output)
- 🧠 OpenAI-compatible API support (`/v1/chat/completions`)
- 🛑 Automatic request cancellation (prevents overlapping generations)
- 📦 Simple model listing support (`/v1/models`)
- 🎯 Direct DOM streaming (no frameworks required)
- 🔥 Works with `llama.cpp` server or any OpenAI-like backend

---

## 📦 Setup

Make sure your backend server (like **llama.cpp**) is running:

```bash
./llama-server -m model.gguf --port 5004
````

Then connect your frontend:

```js
setServerUrl("http://127.0.0.1:5004");
```

---

## 🧠 API Overview

### 1. Set Server URL

```js
setServerUrl(baseUrl);
```

#### Example:

```js
setServerUrl("http://127.0.0.1:5004");
```

This configures:

* `/v1/chat/completions`
* `/v1/models`

---

### 2. Get Streaming Response

```js
get_response(body, element);
```

#### Parameters:

| Name      | Type        | Description                       |
| --------- | ----------- | --------------------------------- |
| `body`    | Object      | Chat request payload              |
| `element` | HTMLElement | DOM element to stream output into |

#### Example:

```js
get_response(
  {
    model: "default",
    messages: [
      { role: "user", content: "Explain quantum physics simply" }
    ]
  },
  document.getElementById("output")
);
```

---

### ⚡ Streaming Behavior

* Response is streamed in real-time
* Each token is appended instantly to the DOM
* Supports SSE (`data:` chunks)
* Automatically handles `[DONE]`

---

### 🛑 Stop Generation

```js
stop_generation();
```

Stops any ongoing request immediately.

#### Example:

```js
setTimeout(() => {
  stop_generation();
}, 5000);
```

---

### 📦 Get Available Models

```js
get_models();
```

#### Example:

```js
const models = await get_models();
console.log(models);
```

Returns:

```json
[
  { "id": "default" }
]
```

---

## 🧩 Full Example

```js
import {
  setServerUrl,
  get_response,
  stop_generation,
  get_models
} from "./llama-api.js";

setServerUrl("http://127.0.0.1:5004");

function askAI() {
  const output = document.getElementById("output");

  get_response(
    {
      model: "default",
      messages: [
        { role: "user", content: "Explain AI simply" }
      ]
    },
    output
  );
}

askAI();
```

---

## ⚙️ Requirements

* Modern browser (ES Modules support)
* Backend compatible with OpenAI API format
* Works best with:

  * llama.cpp server
  * Ollama (OpenAI mode)
  * Local LLM APIs

---

## 🔥 How It Works

1. Sends request to:

```
/v1/chat/completions
```

2. Receives streaming SSE response:

```
data: { "choices": [...] }
```

3. Parses chunks and extracts:

```js
delta.content
```

4. Appends to DOM in real-time

---

## 🧠 Notes

* Automatically cancels previous request before starting a new one
* Handles malformed chunks safely
* Uses AbortController for clean interruption
* Designed for minimal setup and maximum simplicity

---

## Example

 * This example is made for LLAMA.CPP's llama-server
```js
setServerUrl("http://127.0.0.1:5004");


function askAI() {
  const output = document.getElementById("output");

  get_response(
    {
      model: "default",
      messages: [
        { role: "user", content: "Explain quantum physics simply" }
      ]
    },
    output
  );
}

setTimeout(()=>{
    stop_generation();
}, 1000)

askAI();
```
---

## 🛑 License

CC0 (Public Domain)

---

## 💡 Author

Made by **ghgltggamer (2026)**
With help from AI 🤖✨
