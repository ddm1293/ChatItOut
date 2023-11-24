from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from langchain.memory.chat_message_histories.sql import BaseMessageConverter, SQLChatMessageHistory
from langchain.schema import AIMessage, BaseMessage, HumanMessage, SystemMessage
from sqlalchemy import Column, DateTime, Integer, Text
from datetime import datetime
from typing import Any

Base = declarative_base()

class CustomMessage(Base):
    __tablename__ = "test_message_store"

    id = Column(Integer, primary_key=True)
    session_id = Column(Text)
    type = Column(Text)
    content = Column(Text)
    created_at = Column(DateTime)


class CustomMessageConverter(BaseMessageConverter):
    def from_sql_model(self, sql_message: Any) -> BaseMessage:
        if sql_message.type == "human":
            return HumanMessage(
                content=sql_message.content,
            )
        elif sql_message.type == "ai":
            return AIMessage(
                content=sql_message.content,
            )
        elif sql_message.type == "system":
            return SystemMessage(
                content=sql_message.content,
            )
        else:
            raise ValueError(f"Unknown message type: {sql_message.type}")

    def to_sql_model(self, message: BaseMessage, session_id: str) -> Any:
        now = datetime.now()
        return CustomMessage(
            session_id=session_id,
            type=message.type,
            content=message.content,
            created_at=now,
        )

    def get_sql_model_class(self) -> Any:
        return CustomMessage

# start the db
def init_db():
    engine = engine = create_engine("sqlite:///chat_history.db")
    Base.metadata.create_all(engine)