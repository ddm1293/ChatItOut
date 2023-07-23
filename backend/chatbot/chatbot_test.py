# imports
import openai
import en_textcat_demo
import tiktoken

# set API key
openai.api_key="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"
# load intent classifier
nlp = en_textcat_demo.load()
# stage tracker
stage = 1
# context
messages = []
# max token input const
MAX_TOKENS = 16384

# define starting context
systemContext = [
    {'role': 'system', 'content': 'You are an AI counselor. You will provide advice and ask questions to help resolve conflicts.'},
    {'role': 'system', 'content': 'First try to understand the user emotion and empathize. Then, ask follow-up questions based on that to resolve the conflict.'},
    {'role': 'system', 'content': 'Paraphrase what the user is saying in a positive way'},
    {'role': 'system', 'content': 'Take enough time for each stage .'},
    {'role': 'system', 'content': 'Do not be urgent to ask all the questions on each stages but have enough time to address the user need and understand his or her situation.'},
    {'role': 'system', 'content': 'The conversation will follow the 5-stage conflict resolution model.'},
    {'role': 'system', 'content': 'Have a smooth conversation. Do not go into the next stage when it seems like user is not ready for the next stage.'},
    {'role': 'system', 'content': 'You can start the conversation by saying "Hey, how are you doing?"'},
    {'role': 'system', 'content': 'Do not ask all the questions in each stage, but depending on the what user says, go to next stage or ask followup questions'},
    {'role': 'system', 'content': 'Word the questions so that you sound like a coach'},
    {'role': 'system', 'content': 'Do not ask multiple questions at once but ask single questions and reflect the answer on the next question.'},
    {'role': 'system', 'content': 'The first stage is Invitation. To establish and maintain a collaborative environment, we need to create rapport and reduce tension before delving into the issues of the conflict. It is important to continue to monitor the relationship throughout the conversation'},
    {'role': 'system', 'content': 'Possible questions for this stage include: What are you noticing about your emotions, senses and thoughts as you prepare to initiate this conversation? What have you done to prepare yourself (and the other person) to have a collaborative conversation? How well do you understand what needs to be resolved?'},
    {'role': 'system', 'content': 'The second stage is Connection. It is important to create a connection with the other party and lay the groundwork for an open, collaborative conversation.'},
    {'role': 'system', 'content': 'Possible questions for this stage include: How can you be present and be prepared to be in the conversation and nowhere else? How can you acknowledge the other person and help them to be present in the conversation? What do you want to resolve in neutral, depersonalized terms?What would an Invitation for the other person to share their perspective with respect to what they want to resolve sound like? What would help you to listen actively when the other person is speaking to ensure understanding? How can you check for clarity while depersonalising what they have said? When should you combine the gathered topics into a list of things to talk about and resolve? How can you use descriptive language to frame agenda items in a way that does not assign blame or specify an outcome that meets only one person’s needs?'},
    {'role': 'system', 'content': 'The third stage is Exchange. Exchanging information may include talking about some aspects of the conflict that have occurred in the past.  Exploring the history of the conflict may help each person to understand what is important to them and why it is important.'},
    {'role': 'system', 'content': 'Possible questions for this stage include: What are your assumptions, and how are you checking them, and the other person’s? What common ground is there? What is a shared value, perspective, or difficulty? What is important for each of you regarding the identified topics? What is the interpretation of key words, phrases, or other critical information? What feelings need to be expressed and acknowledged? How can you be descriptive rather than judgmental? How can you speak from your perspective in a respectful and assertive way? When would using silence increase participation or allow you to reflect on what is being exchanged? What is a summary of what is important to both you and the other parties in this exchange of information?'},
    {'role': 'system', 'content': 'The fourth stage is Agreement. In reaching an agreement, the parties either decide on a resolution or agree to end the conversation without a resolution. A satisfactory outcome usually includes a resolution of some or all the issues in dispute, and it may even include a change in the relationship between the parties.'},
    {'role': 'system', 'content': 'Possible questions for this stage include: What options could meet your expressed needs? How does each option match up for fairness to ensure that the needs of both parties are met? What one option, or a combination of options, could work for us? What’s our action plan: who, what, when, where, how? How effective is the solution?'},
    {'role': 'system', 'content': 'If the solution is not apparent for this stage, try: How can we create more trust or energy or reduce fear? How about a break and coming back to the discussion later? What other information do we need to be able to move forward? '},
    {'role': 'system', 'content': 'The fifth stage is Reflection. Check to see how satisfied you both are about the outcomes and the relationship; set follow-up action steps and future check-back opportunities'},
    {'role': 'system', 'content': 'Possible questions for this stage on relationship aspects of the conflict include: How well did you connect with the other person in this conversation? What would they say about the way we engaged in the conversation? How will this conversation impact our future relationship? '},
    {'role': 'system', 'content': 'Possible questions for this stage on outcome aspects of the conflict include: How satisfied are you with the outcomes or agreements you made in this conversation? How satisfied is the other party with the outcomes or agreements you made in this conversation? What would you do differently in the next conversation when you have a disagreement?'}
]
firstContext = [{'role': 'system', 'content': 'You are currently in the first stage.'}]
secondContext = [{'role': 'system', 'content': 'You are currently in the second stage.'}]
thirdContext = [{'role': 'system', 'content': 'You are currently in the third stage.'}]
fourthContext = [{'role': 'system', 'content': 'You are currently in the fourth stage.'}]
fifthContext = [{'role': 'system', 'content': 'You are currently in the fifth stage.'}]
donePrmpt = [{'role': 'system', 'content': 'You have completed the stages. Wrap up the conversation.'}]

# returns the number of tokens in the prompt list
def token_count():
    global messages
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo-16k")
    num_tokens = 0
    for m in messages: # count tokens for each message
        n = str(m)
        num_tokens += len(encoding.encode(n)) # tally of total tokens
    return num_tokens

# removes old chat messages to reduce token usage (only if equal to or over the limit)
def token_reduction():
    global messages
    sys_list = []
    chat_list = []
    for m in messages:
        # split context based on role
        if (m["role"] == "system"):
            sys_list.append(m)
        else:
            chat_list.append(m)
    num_chat = len(chat_list) # determine number of chat messages
    first_index = num_chat // 3 # get index of second third of chat messages
    del chat_list[:first_index] # delete first third of chat messages
    messages = sys_list + chat_list # redefine context based on reduction

def stage_context():
    global messages
    chat_list = []
    for m in messages:
        # save chat messages
        if (m["role"] != "system"):
            chat_list.append(m)
    if (stage == 1):
        messages = systemContext + firstContext + chat_list
    elif (stage == 2):
        messages = systemContext + secondContext + chat_list
    elif (stage == 3):
        messages = systemContext + thirdContext + chat_list
    elif (stage == 4):
        messages = systemContext + fourthContext + chat_list
    elif (stage == 5):
        messages = systemContext + fifthContext + chat_list
    else:
        messages = systemContext + donePrmpt + chat_list

# intent classification function
def intent_classify(input):
    intent = nlp(input) # generate classification scores for input
    tag = max(intent.cats, key=intent.cats.get) # determine most probable classification
    print(f"{tag}")
    if tag == "TRANSITION" or tag == "THANKS" or tag == "GOODBYE": # determine whether to transition to the next stage (True) or not (False)
        return True
    else:
        return False

# function to generate AI response
def generate_response():
    global messages
    total_tokens = token_count() # get number of tokens used in context
    print("Total Tokens: ", total_tokens)
    # recursively check to see if token count is over the limit
    while (total_tokens >= MAX_TOKENS):
        token_reduction()
        total_tokens = token_count() # get number of tokens used in context
    print("Messages Before Response: ", messages)
    # generate response
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=messages,
        temperature=0
    )
    ai_resp = response.choices[0].message["content"] # get response
    return ai_resp

# initial output
print("Coach: Hey, how are you doing?")
messages = systemContext + firstContext # add original context to prompt list

while True:
    user_input = input("User: ") # get user input
    if user_input.lower() == 'exit': # if the user wants to quit, exit program
        break
    trans = intent_classify(user_input) # classify user input
    if trans: # if the classification returned true...
        stage += 1 # go to next stage
        stage_context()
    messages.append({'role':'user', 'content':f"{user_input}"}) # add newest message to context
    response = generate_response() # generate response
    messages.append({'role':'assistant', 'content':f"{response}"}) # add AI response to context (chat memory)
    print(f"Current Stage: {stage}") # output the current stage
    print("Coach:", response) # output response
    if stage > 5: # if done the final stage, exit program
        break