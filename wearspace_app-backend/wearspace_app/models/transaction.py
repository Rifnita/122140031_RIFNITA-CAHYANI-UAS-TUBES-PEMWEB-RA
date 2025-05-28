import uuid
from sqlalchemy import Column, DateTime, Text, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .meta import Base, UUIDColumn

class Transaction(Base):
    __tablename__ = 'transactions'
    id = Column(UUIDColumn, primary_key=True, default=uuid.uuid4)
    user_id = Column(UUIDColumn, ForeignKey('users.id'))
    # --- PERBAIKAN DI SINI ---
    # Tambahkan ondelete='CASCADE' pada ForeignKey
    product_id = Column(UUIDColumn, ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    # --- AKHIR PERBAIKAN ---
    customer_name = Column(String(255), nullable=False)
    shipping_address = Column(Text, nullable=False)
    payment_method = Column(String(50), nullable=False)
    transaction_status = Column(String(50), nullable=False, default='Menunggu Pembayaran')
    purchased_size = Column(String(10), nullable=False)
    purchased_color = Column(String(50), nullable=False)
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship('User', back_populates='transactions')
    product = relationship('Product', back_populates='transactions')