from sqlalchemy import select, and_, or_
from dao.base import BaseDAO
from chat.models import Message
from database.database import async_session_maker


class MessagesDAO(BaseDAO):
    model = Message

    @classmethod
    async def get_messages_between_users(cls, user1_id, user2_id):
        """
        Асинхронно находит и возвращает все сообщения между двумя пользователями.

        Аргументы:
            user_id_1: ID первого пользователя.
            user_id_2: ID второго пользователя.

        Возвращает:
            Список сообщений между двумя пользователями.
        """
        async with async_session_maker() as session:
            query = (
                select(cls.model)
                .filter(
                    or_(
                        and_(
                            cls.model.sender_id == user1_id,
                            cls.model.recipient_id == user2_id,
                        ),
                        and_(
                            cls.model.sender_id == user2_id,
                            cls.model.recipient_id == user1_id,
                        ),
                    )
                )
                .order_by(cls.model.id)
            )
            result = await session.execute(query)
            return result.scalars().all()
