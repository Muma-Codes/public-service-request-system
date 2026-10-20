from . import db
from typing import Optional
from typing import List
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy import UniqueConstraint
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

class ServiceCategory(db.Model, SerializerMixin):
    __tablename__ = "service_categories"

    serialize_rules = ('-admin_add.add_categories', '-admin_add.update_categories', '-admin_update.add_categories', '-admin_update.update_categories', '-service_requests.category')

    service_category_id: Mapped[int] = mapped_column(primary_key=True)
    service_category_name: Mapped[str] = mapped_column(String(50))
    added_by: Mapped[int] = mapped_column(ForeignKey("citizens.citizen_id"))
    updated_by: Mapped[Optional[int]] = mapped_column(ForeignKey("citizens.citizen_id"))
    added_at: Mapped[datetime] = mapped_column(DateTime(), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(), onupdate=func.now())

    admin_add: Mapped["Citizen"] = relationship(back_populates="add_categories", foreign_keys=[added_by])
    admin_update: Mapped[Optional["Citizen"]] = relationship(back_populates="update_categories", foreign_keys=[updated_by])
    service_requests: Mapped[List["CitizenServiceRequest"]] = relationship(back_populates="category")

    __table_args__ = (
        UniqueConstraint('service_category_name', name='uq_service_category_name'),
    )

    def __repr__(self) -> str:
        return f"ServiceCategory(id={self.service_category_id!r}, name={self.service_category_name!r}, added_by={self.added_by!r}, added_at={self.added_at!r})"
