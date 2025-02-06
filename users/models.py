from sqlalchemy import String, UUID
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from database.database import Base


class User(Base):
    __tablename__ = "users"

    uuid: Mapped[UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    username:Mapped[str] = mapped_column(String, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
