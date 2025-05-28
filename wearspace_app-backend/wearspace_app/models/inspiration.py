# your_project_name/models/inspiration.py
import uuid
from sqlalchemy import Column, DateTime, Text, String
from sqlalchemy.sql import func
from .meta import Base, UUIDColumn

class Inspiration(Base):
    __tablename__ = 'inspirations'
    id = Column(UUIDColumn, primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(String(255))
    tag = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())