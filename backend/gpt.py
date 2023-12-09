import openai
import os
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationSummaryBufferMemory
from get_prompt import load_prompt
import sqlite3
from langchain.memory.chat_message_histories import SQLChatMessageHistory
from init_db import CustomMessageConverter

# load .env file
load_dotenv()

# set API key
openai.api_key= os.environ.get('OPENAI_API_KEY')

MAX_TOKENS = 8192

llm = ChatOpenAI(model_name="gpt-4", temperature=0.5)

def check_session_exists(session_id):
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()
    query = "SELECT EXISTS(SELECT 1 FROM test_message_store WHERE session_id = ? LIMIT 1)"
    cursor.execute(query, (session_id,))
    return cursor.fetchone()[0] == 1

def fetch_chat_history(session_id):
    test_history = SQLChatMessageHistory(
            session_id=session_id,
            connection_string="sqlite:///chat_history.db",
            custom_message_converter=CustomMessageConverter(),
        )
    return test_history.messages

def delete_session_in_db(session_id):
    try: 
        conn = sqlite3.connect('chat_history.db')
        cursor = conn.cursor()
        query = f"delete from test_message_store where session_id = ?"
        cursor.execute(query, (session_id,))
        conn.commit()
        return True
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

memory = ConversationSummaryBufferMemory(llm=llm, max_token_limit=MAX_TOKENS, memory_key="history", return_messages=True)

def get_response(input):
    try:
        print(f"see input: {input}")
        stage = input["stage"]
        new_user_message = input["newMsg"]
        session_id = input["sessionId"]

        chat_message_history = SQLChatMessageHistory(session_id=session_id,
                                                        table_name="test_message_store",
                                                        connection_string="sqlite:///chat_history.db",
                                                        custom_message_converter=CustomMessageConverter())
        print(f"see chat_message_history.messages: {chat_message_history.messages}")
        memory.chat_memory.messages = chat_message_history.messages
        prompt = load_prompt(stage)
        
        conversation = ConversationChain(llm=llm, prompt=prompt, memory=memory, verbose=True)
        response = conversation(new_user_message)

        chat_message_history.add_user_message(new_user_message)
        chat_message_history.add_ai_message(response["response"])
        print(f"see stored chat_history: {chat_message_history.messages}")
        return {'ai': response["response"], 'stage': stage}
    except Exception as e:
        print(f"excpetion: {e}")