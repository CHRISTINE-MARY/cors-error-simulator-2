import React, { useRef, useState } from "react";
import FrontendEditor from "./FrontendEditor";
import BackendEditor from "./BackendEditor";
import { runCode } from "./runFrontend";
import { stat } from "fs";

export default function App() {
  const [frontendCode, setFrontendCode] =
    useState(`fetch("https://your-backend-url.com/data")
  .then(res => res.json())
  .then(data => document.body.innerHTML = "<h1>" + data.msg + "</h1>")
  .catch(err => document.body.innerHTML = "<pre style='color:red'>" + err + "</pre>");`);

  const [backendCode, setBackendCode] = useState(`# Flask backend example
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Try removing this to simulate CORS error

@app.route("/data")
def data():
    return {"msg": "Hello from Backend"}
`);

  const [backendUrl, setBackendUrl] = useState("");
  
  const [status,setStatus]=useState("Unknown");
  const intervalRef = useRef<number | null>(null);
  const run = async () => {
    setStatus("Unknown")
    const requestId = crypto.randomUUID();
    if (!backendUrl) {
      alert("Enter backend URL!");
      return;
    }

    // Replace placeholder in frontend code
    const modifiedCode = frontendCode.replace(
      /https:\/\/your-backend-url\.com(\/[^\s'"]*)?/g,
      (_, path = "") =>
        `http://localhost:8080/proxy${path}?backend=${encodeURIComponent(
          backendUrl
        )}&requestId=${requestId}`
    );

    // Send to backend for bundling
    try {
      const res = await fetch("http://localhost:8080/bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: modifiedCode }),
      });

      const data = await res.json();
      if (data.url) {
        const html = `
   
        <!DOCTYPE html>
        <html>
          <body>
            <div id="root"></div>
            <script src="http://localhost:8080${data.url}"></script>
          </body>
        </html>`;
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const iframe = document.getElementById("preview") as HTMLIFrameElement;

        if (iframe) {
          iframe.src = url;
        }
         if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        // Start new interval to check status
        intervalRef.current = window.setInterval(async () => {
          try {
            const statusRes = await fetch(
              `http://localhost:8080/status/${requestId}`
            );
            const statusData = await statusRes.json();
            setStatus(statusData.status);

            // Optionally stop polling if status is final
            if (
              statusData.status !== "Pending" &&
              statusData.status !== "Unknown"
            ) {
              clearInterval(intervalRef.current!);
              intervalRef.current = null;
            }
          } catch (e) {
            setStatus("Unknown");
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
          }
        }, 1500);
      } else {
        alert("Bundling failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to bundler");
    }
  };

  const handleDeployBackend = async () => {
    const res = await fetch("http://localhost:8080/run-backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: backendCode }),
    });

    const data = await res.json();
    if (data.url) {
      setBackendUrl(data.url);
      alert("Backend is running at: " + data.url);
    } else {
      alert("Backend error: " + JSON.stringify(data));
    }
  };

  return (
    <div>
      <FrontendEditor code={frontendCode} setCode={setFrontendCode} />
      <BackendEditor code={backendCode} setCode={setBackendCode} />

      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
          placeholder="Paste backend URL here"
          style={{ width: "80%" }}
        />
        <button onClick={run}>Run Frontend</button>
        <button onClick={handleDeployBackend}>Deploy Backend</button>

        <iframe
          id="preview"
          title="Preview"
          src=""
          style={{
            width: "100%",
            height: "400px",
            border: "1px solid #ccc",
            marginTop: "10px",
          }}
        />
      </div>
      <div>
        {status}
      </div>
    </div>
  );
}
