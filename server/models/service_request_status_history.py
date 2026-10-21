from . import db
from typing import Optional
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime


class ServiceRequestStatusHistory(db.Model, SerializerMixin):
    """
    One row for every status a request has entered, including the first "Pending".
    This is what lets the frontend show a date for each step of the tracker.
    """
    __tablename__ = "service_request_status_history"

    # Citizens receive these rows, so expose only what the tracker needs (no admin identity)
    serialize_only = ("history_id", "status", "updated_at")

    history_id: Mapped[int] = mapped_column(primary_key=True)
    service_request_id: Mapped[int] = mapped_column(ForeignKey("citizen_service_requests.service_request_id"))
    status: Mapped[str] = mapped_column(String(20))
    # Who made the change. Kept for auditing, never serialized. SET NULL keeps history if the account is removed.
    changed_by: Mapped[Optional[int]] = mapped_column(ForeignKey("citizens.citizen_id", ondelete="SET NULL"), nullable=True)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, onupdate=func.now())

    service_request: Mapped["CitizenServiceRequest"] = relationship(back_populates="status_history")

    def __repr__(self) -> str:
        return f"StatusHistory(id={self.history_id!r}, request={self.service_request_id!r}, status={self.status!r}, updated_at={self.updated_at!r})"