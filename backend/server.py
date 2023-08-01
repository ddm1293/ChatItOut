from flask import Flask, make_response
from flask import request
from chatbot.chatbot_tokens import *

app = Flask(__name__)

@app.post('/home/chat')
def talk_to_ai():
    data = request.json
    ai_resp = generate_response(data)
    return ai_resp

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', 'https://chatitout.onrender.com')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

if __name__ == "__main__":
    app.run(debug=False)