# PROGRAM NAME: chatbot_v1.py
# AUTHOR(S): Brianna Drew
# DATE CREATED: 2023-06-19
# LAST MODIFIED: 2023-06-26
# DESCRIPTION: This Python script uses OpenAI's Chat GPT-3.5 API and
#              LlamaIndex to create a chatbot trained with custom data

# Imports
from llama_index import (
    load_index_from_storage,
    StorageContext,
    SimpleDirectoryReader,
    GPTVectorStoreIndex,
    LLMPredictor,
    PromptHelper,
    ServiceContext
)
from llama_index.prompts.base import Prompt
from llama_index.prompts.prompts import RefinePrompt
from langchain.chat_models import ChatOpenAI
from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.agents import initialize_agent
from langchain.prompts.chat import(AIMessagePromptTemplate,ChatPromptTemplate,HumanMessagePromptTemplate)
from llama_index.langchain_helpers.agents import LlamaToolkit, create_llama_chat_agent
import openai as oai
import os

# set API key
os.environ["OPENAI_API_KEY"] = "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"
oai.api_key = "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"

# set maximum input size
max_input_size = 4096
# set number of output tokens
num_outputs = 2000
# set maximum chunk overlap
max_chunk_overlap = 20
# set chunk size limit
chunk_size_limit = 600

# define prompt helper
prompt_helper = PromptHelper(
    max_input_size,
    num_outputs,
    max_chunk_overlap=max_chunk_overlap,
    chunk_size_limit=chunk_size_limit,
)

# define LLM
llm_predictor = LLMPredictor(
    llm=ChatOpenAI(temperature=1, streaming=True, max_tokens=num_outputs)
)
service_context = ServiceContext.from_defaults(
    llm_predictor=llm_predictor, prompt_helper=prompt_helper
)

# define base prompt
template = ("You are a chatbot who's purpose is to coach the client through a conflict. Given the example conversations below: \n"
    "---------------------\n"
    "{context_str}"
    "\n---------------------\n"
    "Emulate the style of these conversations where you are the coach responding to your client: {query_str}\n"
    "If this new context is not useful, fallback on prior knowledge to respond.\n")
template_prompt = Prompt(template)

# Refine Prompt
CHAT_REFINE_PROMPT_TMPL_MSGS = [
    HumanMessagePromptTemplate.from_template("{query_str}"),
    AIMessagePromptTemplate.from_template("{existing_answer}"),
    HumanMessagePromptTemplate.from_template(
        "I have more context below which can be used "
        "(only if needed) to update your previous answer.\n"
        "------------\n"
        "{context_msg}\n"
        "------------\n"
        "Given the new context, update the previous answer to better "
        "answer my previous query."
        "If the previous answer remains the same, repeat it verbatim. "
        "Never reference the new context or my previous query directly.",
    ),
]
CHAT_REFINE_PROMPT_LC = ChatPromptTemplate.from_messages(CHAT_REFINE_PROMPT_TMPL_MSGS)
CHAT_REFINE_PROMPT = RefinePrompt.from_langchain_prompt(CHAT_REFINE_PROMPT_LC)

# construct 
def construct_index(directory_path):
    # load data
    documents = SimpleDirectoryReader(directory_path).load_data()
    # build index
    index = GPTVectorStoreIndex.from_documents(documents, service_context=service_context)
    index.set_index_id("vector_index")
    index.storage_context.persist(persist_dir="./storage")
    return index


def ask_ai():
    storage_context = StorageContext.from_defaults(persist_dir="./storage")
    # load index
    index = load_index_from_storage(
        service_context=service_context,
        storage_context=storage_context,
        index_id="vector_index",
    )
    query_engine = index.as_query_engine(text_qa_template=template_prompt, refine_template=CHAT_REFINE_PROMPT, service_context= service_context, streaming=True, similarity_top_k=2)
    user_input = input("What brings you here today? ")
    streaming_response = query_engine.query(user_input)
    streaming_response.print_response_stream()


# construct index
construct_index("data")
# begin chat
ask_ai()
exit()
