import uuid
from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .meta import Base, UUIDColumn

class Favorite(Base):
    __tablename__ = 'favorites'
    user_id = Column(UUIDColumn, ForeignKey('users.id'), primary_key=True)
    # --- PERBAIKAN DI SINI ---
    # Tambahkan ondelete='CASCADE' pada ForeignKey
    product_id = Column(UUIDColumn, ForeignKey('products.id', ondelete='CASCADE'), primary_key=True)
    # --- AKHIR PERBAIKAN ---
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship('User', back_populates='favorites')
    product = relationship('Product', back_populates='favorites')