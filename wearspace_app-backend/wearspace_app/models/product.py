import uuid
from sqlalchemy import Column, DateTime, Text, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .meta import Base, UUIDColumn

class Product(Base):
    __tablename__ = 'products'
    id = Column(UUIDColumn, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    brand_id = Column(UUIDColumn, ForeignKey('brands.id'), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    description = Column(Text)
    image_url = Column(String(255))
    material = Column(String(100))
    category = Column(String(100))
    stock = Column(Integer, default=0)
    sizes = Column(ARRAY(String(10)))
    colors = Column(ARRAY(String(50)))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    brand = relationship('Brand', back_populates='products')

    # --- PERBAIKAN DI SINI ---
    # Ketika Product dihapus, hapus juga Transaction terkait.
    # 'all, delete-orphan' akan menghapus objek terkait.
    # passive_deletes=True penting agar database yang menangani ON DELETE CASCADE.
    transactions = relationship(
        'Transaction',
        back_populates='product',
        cascade='all, delete-orphan', # Hapus transaksi terkait jika produk dihapus
        passive_deletes=True,        # Biarkan database yang melakukan CASCADE
        lazy=True
    )

    # Ketika Product dihapus, hapus juga Favorite terkait.
    favorites = relationship(
        'Favorite',
        back_populates='product',
        cascade='all, delete-orphan', # Hapus favorit terkait jika produk dihapus
        passive_deletes=True,        # Biarkan database yang melakukan CASCADE
        lazy=True
    )
    # --- AKHIR PERBAIKAN ---