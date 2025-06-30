from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
import uuid
import os
import subprocess
from middleware import proxy,get_status


esbuild = os.path.abspath("node_modules/.bin/esbuild.cmd")


app = Flask(__name__)
CORS(app)

@app.route("/proxy/<path:path>", methods=["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"])
def proxy_route(path):
    return proxy(path)


@app.route("/status/<request_id>")
def status_route(request_id):
    print("requested",request_id)
    return get_status(request_id)

@app.route("/bundle", methods=["POST"])
def bundle_react_code():
    user_code = request.json.get("code")
    if not user_code:
        return {"error": "No code provided"}, 400

    uid = str(uuid.uuid4())
    base_dir = f"./user_bundles/{uid}"
    os.makedirs(base_dir, exist_ok=True)

    # Write code to file
    with open(f"{base_dir}/App.jsx", "w", encoding="utf-8") as f:
        f.write(user_code)

    # Write basic index file
    with open(f"{base_dir}/index.js", "w", encoding="utf-8") as f:
        f.write(
            "import React from 'react';\n"
            "import ReactDOM from 'react-dom/client';\n"
            "import App from './App.jsx';\n"
            "const root = ReactDOM.createRoot(document.getElementById('root'));\n"
            "root.render(<App />);"
        )
    # Bundle using esbuild
    output_file = f"{base_dir}/bundle.js"
    result = subprocess.run([
        esbuild,
        f"{base_dir}/index.js",
        "--bundle",
        "--outfile=" + output_file,
        "--loader:.js=jsx",
        "--format=iife",
    ])

    if result.returncode != 0:
        return {"error": "Bundling failed"}, 500

    return jsonify({ "url": f"/bundle/{uid}" })


@app.route("/bundle/<uid>")
def serve_bundle(uid):
    path = f"./user_bundles/{uid}/bundle.js"
    if not os.path.exists(path):
        return "Not found", 404
    return send_file(path)



@app.route("/run-backend", methods=["POST"])
def run_backend():
    code = request.json.get("code")
    if not code:
        return jsonify({"error": "No code provided"}), 400

    folder_id = str(uuid.uuid4())
    folder_path = f"./runs/{folder_id}"
    os.makedirs(folder_path, exist_ok=True)

    with open(f"{folder_path}/app.py", "w", encoding="utf-8") as f:
        # Force app.run at the end of user-submitted code
        f.write(code + '\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=5000)')


    port = 5000 + int(folder_id[-4:], 16) % 1000  # Dynamic port between 5000-5999
    container_name = f"backend_{folder_id}"

    subprocess.run([
        "docker", "run", "-d",
        "-v", f"{os.path.abspath(folder_path)}:/app",
        "-p", f"{port}:5000",
        "--name", container_name,
        "flask-runner"
    ])

    return jsonify({"url": f"http://localhost:{port}/"})


if __name__ == "__main__":
    app.run(port=8080)
