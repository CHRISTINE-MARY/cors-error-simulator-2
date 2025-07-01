# Flask backend example
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
#CORS(app)  # Try removing this to simulate CORS error

@app.route("/data")
def data():
    return {"msg": "Hello from Backend"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)