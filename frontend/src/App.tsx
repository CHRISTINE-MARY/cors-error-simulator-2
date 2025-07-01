import React, { useRef, useState } from "react";
import FrontendEditor from "./FrontendEditor";
import BackendEditor from "./BackendEditor";
import "./App.css";

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

  const backend_url = process.env.REACT_APP_BACKEND_URL;
  console.log("url",backend_url);
  const [backendUrl, setBackendUrl] = useState("");
  const [frameWidth, setWidth] = useState(0);
  const [status, setStatus] = useState("Unknown");
  const intervalRef = useRef<number | null>(null);
  const [frontendBackUrl, setFrontendUrl] = useState("");
  const [error, setError] = useState("");
  const run = async () => {
    setStatus("Unknown");

    const requestId = crypto.randomUUID();
    if (!backendUrl) {
      setError("Enter backend URL!");
      return;
    }
    if (!frontendBackUrl) {
      setError("enter valid url");
      return;
    }

    // Replace placeholder in frontend code
    if (!frontendCode.includes(frontendBackUrl)) {
      setError("Frontend URL not found in code!");
      return;
    }
    const escapedUrl = frontendBackUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex chars
    const regex = new RegExp(`${escapedUrl}(\/[^\s'"]*)?`, "g");

    const modifiedCode = frontendCode.replace(
      regex,
      (_, path = "") =>
        `${backend_url}/proxy${path}?backend=${encodeURIComponent(
          backendUrl
        )}&requestId=${requestId}`
    );

    if (/return\s/.test(modifiedCode)) {
      setWidth(1);
    } else {
      setWidth(0);
    }

    // Send to backend for bundling
    try {
      const res = await fetch(`${backend_url}/bundle`, {
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
            <script src="${backend_url}${data.url}"></script>
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
            const statusRes = await fetch(`${backend_url}/status/${requestId}`);
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
    setBackendUrl("");
    const res = await fetch(`${backend_url}/run-backend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: backendCode }),
    });

    const data = await res.json();
    if (data.url) {
      setBackendUrl(data.url);
    } else {
      setError("Error deploying backend");
    }
  };

  return (
    <div className="mt-3">
      <div className="flex flex-col">
        <div className="flex justify-center w-full">
          {error && <div className="text-red-500">{error}</div>}
          <div
            className={`px-4 py-1 rounded-md text-white ${
              status === "CORS Error" || status === "Other Error"
                ? "bg-red-500"
                : status === "Connection OK"
                ? "bg-green-500"
                : ""
            }`}
          >
            {status}
          </div>
        </div>
        <div className="flex flex-row pt-4">
          <div className={` mt-2 ${frameWidth > 0 ? "w-1/3" : "w-1/2"}`}>
            <button
              onClick={run}
              className="ml-3 border-1 px-3 py-1 rounded-sm bg-blue-500 text-white focus:bg-black"
            >
              Run Frontend
            </button>
            <FrontendEditor
              code={frontendCode}
              setCode={setFrontendCode}
              setUrl={setFrontendUrl}
            />
          </div>
          <div className={` mt-2 ${frameWidth > 0 ? "w-1/3" : "w-1/2"}`}>
            <button
              onClick={handleDeployBackend}
              className="ml-3 border-1 px-3 py-1 rounded-sm bg-blue-500 text-white focus:bg-black"
            >
              Deploy Backend
            </button>
            <BackendEditor
              code={backendCode}
              setCode={setBackendCode}
              backendUrl={backendUrl}
            />
          </div>

          <iframe
            id="preview"
            title="Preview"
            src=""
            className={`border mt-2 ${frameWidth > 0 ? "w-1/3" : "hidden"}`}
          />
        </div>
      </div>
    </div>
  );
}
