import re
from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
import uuid
import os
import subprocess
from middleware import proxy,get_status
import threading
import time
import shutil
from datetime import datetime, timedelta

CLEANUP_INTERVAL = 300 # Run every 5 minutes
LIFETIME = timedelta(minutes=30)


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

def remove_main_block(code):
    code = re.sub(
        r'if\s+__name__\s*==\s*[\'"]__main__[\'"]\s*:\s*(?:\n\s+.+)+',
        '',
        code
    )

    # Remove any top-level app.run(...) lines outside functions
    code = re.sub(
        r'^\s*app\.run\([^\)]*\)\s*$',  # matches lines like app.run(...)
        '',
        code,
        flags=re.MULTILINE
    )

    return code


@app.route("/run-backend", methods=["POST"])
def run_backend():
    user_code = request.json.get("code")
    if not user_code:
        return jsonify({"error": "No code provided"}), 400

    
    folder_path = f"./runs/docker"
    os.makedirs(folder_path, exist_ok=True)

    code=remove_main_block(user_code)
    with open(f"{folder_path}/app.py", "w", encoding="utf-8") as f:
        # Force app.run at the end of user-submitted code
        f.write(code + '\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=5000)')

    
    container_name = f"backend_docker"

    subprocess.run(["docker", "rm", "-f", container_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    subprocess.run([
        "docker", "run", "-d",
        "-v", f"{os.path.abspath(folder_path)}:/app",
        "-p", f"5000:5000",
        "--name", container_name,
        "flask-runner"
    ])

    return jsonify({"url": f"http://localhost:5000"})


def cleanup_old_folders():
    while True:
        now = datetime.now()

        for root_folder in ["user_bundles", "runs"]:
            full_path = os.path.abspath(root_folder)
            if not os.path.exists(full_path):
                continue

            for folder_name in os.listdir(full_path):
                folder_path = os.path.join(full_path, folder_name)
                try:
                    modified_time = datetime.fromtimestamp(os.path.getmtime(folder_path))
                    if now - modified_time > LIFETIME:
                        shutil.rmtree(folder_path)

                        
                        if root_folder == "runs":
                            container_name = f"backend_{folder_name}"
                            subprocess.run(["docker", "rm", "-f", container_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

                except Exception as e:
                    print(f"[CLEANUP ERROR] {e}")

        time.sleep(CLEANUP_INTERVAL)

# Start the cleanup thread
threading.Thread(target=cleanup_old_folders, daemon=True).start()






if __name__ == "__main__":
    app.run(host="0.0.0.0",port=8080)




