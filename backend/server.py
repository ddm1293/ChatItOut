from flask import Flask, request, send_from_directory
from gpt import *
from init_db import init_db

app = Flask(__name__, static_folder='../frontend/build')

init_db()

# Passes user input to chatbot and passes response to frontend
@app.post('/home/chat')
def talk_to_ai():
    data = request.json
    response = get_response(data)
    print(f"see ai_resp complete: {response}")
    return response

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Add headers that prevent requests being blocked
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', 'https://chatitout-7byl.onrender.com')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)