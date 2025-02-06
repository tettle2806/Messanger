from pydantic import BaseModel, Field
from sqlalchemy import UUID

class MessageRead(BaseModel):
    id: int = Field(..., description="Уникальный идентификатор сообщения")
    sender_id: UUID = Field(..., description="ID отправителя сообщения")
    recipient_id: UUID = Field(..., description="ID получателя сообщения")
    content: str = Field(..., description="Содержимое сообщения")


class MessageCreate(BaseModel):
    recipient_id: UUID = Field(..., description="ID получателя сообщения")
    content: str = Field(..., description="Содержимое сообщения")
