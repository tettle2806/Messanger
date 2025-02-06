from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from typing import List, Dict
from chat.dao import MessagesDAO
from chat.schemas import MessageRead, MessageCreate
from users.dao import UsersDAO
from users.dependencies import get_current_user
from users.models import User
import asyncio
import logging
from sqlalchemy import UUID

router = APIRouter(prefix="/chat", tags=["Chat"])
templates = Jinja2Templates(directory="templates")


# Страница чата
@router.get("/", response_class=HTMLResponse, summary="Chat Page")
async def get_chat_page(request: Request, user_data: User = Depends(get_current_user)):
    users_all = await UsersDAO.find_all()
    return templates.TemplateResponse(
        "chat.html", {"request": request, "user": user_data, "users_all": users_all}
    )


@router.websocket("/messages/{user_id}")
async def get_messages(user_uuid: UUID, current_user: User = Depends(get_current_user)):
    return (
        await MessagesDAO.get_messages_between_users(
            user_id_1=user_uuid, user_id_2=current_user.uuid
        )
        or []
    )


@router.post("/messages", response_model=MessageCreate)
async def send_message(
    message: MessageCreate, current_user: User = Depends(get_current_user)
):
    # Add new message to the database
    await MessagesDAO.add(
        sender_id=current_user.uuid,
        content=message.content,
        recipient_id=message.recipient_id,
    )
    # Подготавливаем данные для отправки сообщения
    message_data = {
        "sender_id": current_user.uuid,
        "recipient_id": message.recipient_id,
        "content": message.content,
    }
    # Уведомляем получателя и отправителя через WebSocket
    await notify_user(message.recipient_id, message_data)
    await notify_user(current_user.uuid, message_data)

    # Возвращаем подтверждение сохранения сообщения
    return {
        "recipient_id": message.recipient_id,
        "content": message.content,
        "status": "ok",
        "msg": "Message saved!",
    }


# Активные WebSocket-подключения: {user_id: websocket}
active_connections: Dict[UUID, WebSocket] = {}


# Функция для отправки сообщения пользователю, если он подключен
async def notify_user(user_id: UUID, message: dict):
    """Отправить сообщение пользователю, если он подключен."""
    if user_id in active_connections:
        websocket = active_connections[user_id]
        # Отправляем сообщение в формате JSON
        await websocket.send_json(message)


# WebSocket эндпоинт для соединений
@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: UUID):
    # Принимаем WebSocket-соединение
    await websocket.accept()
    # Сохраняем активное соединение для пользователя
    active_connections[user_id] = websocket
    try:
        while True:
            # Просто поддерживаем соединение активным (1 секунда паузы)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        # Удаляем пользователя из активных соединений при отключении
        active_connections.pop(user_id, None)
