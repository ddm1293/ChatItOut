from flask import Flask, make_response
from flask import request
from chatHistory import *

app = Flask(__name__)

@app.route('/home/chat/<id>', methods=['GET', 'POST'])
def save_chat(id):
    if request.method == 'POST':
        save(request.json, id)
    response = make_response()
    return response

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response

if __name__ == "__main__":
    app.run(debug=True)