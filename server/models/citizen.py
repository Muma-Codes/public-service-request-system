from . import db
from typing import List
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import UniqueConstraint
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

# define Citizen model class
class Citizen(db.Model, SerializerMixin):
    __tablename__ = "citizens"

    serialize_rules=('-service_requests.citizen', '-update_service_requests_status.update_status', '-add_categories.admin_add', '-update_categories.admin_update')

    citizen_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    phone_number: Mapped[str] = mapped_column(String(13))
    is_admin: Mapped[bool] = mapped_column(Boolean(), default=False)
    password: Mapped[str] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=func.now())

    service_requests: Mapped[List["CitizenServiceRequest"]] = relationship(back_populates="citizen", foreign_keys="CitizenServiceRequest.submitted_by", cascade="all, delete-orphan")
    update_service_requests_status: Mapped[List["CitizenServiceRequest"]] = relationship(back_populates="update_status", foreign_keys="CitizenServiceRequest.status_updated_by", cascade="all, delete-orphan")
    add_categories: Mapped[List["ServiceCategory"]] = relationship(back_populates="admin_add", foreign_keys="ServiceCategory.added_by", cascade="all, delete-orphan")
    update_categories: Mapped[List["ServiceCategory"]] = relationship(back_populates="admin_update", foreign_keys="ServiceCategory.updated_by", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint('phone_number', name='uq_citizen_phone_number'),
    )

    def __repr__(self) -> str:
        return f"Citizen(id={self.citizen_id!r}, name={self.name!r}, phone_number={self.phone_number!r})"

