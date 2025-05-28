# your_project_name/models/user.py
import uuid
from sqlalchemy import Column, DateTime, Text, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .meta import Base, UUIDColumn
from bcrypt import hashpw, gensalt, checkpw

class User(Base):
    __tablename__ = 'users'
    id = Column(UUIDColumn, primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20))
    address = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    transactions = relationship('Transaction', back_populates='user', lazy=True)
    favorites = relationship('Favorite', back_populates='user', lazy=True)

    def set_password(self, password):
        self.hashed_password = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

    def check_password(self, password):
        return checkpw(password.encode('utf-8'), self.hashed_password.encode('utf-8'))