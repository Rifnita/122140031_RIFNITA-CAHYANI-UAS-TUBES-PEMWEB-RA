# your_project_name/models/brand.py
import uuid
from sqlalchemy import Column, DateTime, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .meta import Base, UUIDColumn

class Brand(Base):
    __tablename__ = 'brands'
    id = Column(UUIDColumn, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    products = relationship('Product', back_populates='brand', lazy=True)