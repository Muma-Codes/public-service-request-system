from . import db
from typing import Optional
from typing import List
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import CheckConstraint
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

# Allowed statuses
REQUEST_STATUSES = ("Pending", "In Progress", "Resolved")

class CitizenServiceRequest(db.Model, SerializerMixin):
    __tablename__ = "citizen_service_requests"

    serialize_rules = ('-citizen.password', '-citizen.service_requests', '-citizen.update_service_requests_status', '-citizen.add_categories', '-citizen.update_categories', '-update_status', '-category.admin_add', '-category.admin_update', '-status_history.service_request', '-category.service_requests')

    service_request_id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("service_categories.service_category_id"))
    location: Mapped[str] = mapped_column(String())
    description: Mapped[str] = mapped_column(String())
    image_url: Mapped[Optional[str]] = mapped_column(String(), nullable=True)
    submitted_by: Mapped[int] = mapped_column(ForeignKey("citizens.citizen_id"))
    status_updated_by: Mapped[Optional[int]] = mapped_column(ForeignKey("citizens.citizen_id"), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="Pending")
    submitted_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, onupdate=func.now())

    citizen: Mapped["Citizen"] = relationship(back_populates="service_requests", foreign_keys=[submitted_by])
    category: Mapped["ServiceCategory"] = relationship(back_populates="service_requests")
    update_status: Mapped[Optional["Citizen"]] = relationship(back_populates="update_service_requests_status", foreign_keys=[status_updated_by])
    # Oldest first; history_id breaks ties when two changes land in the same second
    status_history: Mapped[List["ServiceRequestStatusHistory"]] = relationship(
        back_populates="service_request",
        cascade="all, delete-orphan",
        order_by="ServiceRequestStatusHistory.updated_at, ServiceRequestStatusHistory.history_id",
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('Pending', 'In Progress', 'Resolved')",
            name="ck_service_request_status",
        ),
    )

    def __repr__(self) -> str:
        return f"ServiceRequest(id={self.service_request_id!r}, category_id={self.category_id!r}, location={self.location!r}, description={self.description!r}, submitted_by={self.submitted_by!r}, status={self.status!r}, submitted_at={self.submitted_at!r})"
