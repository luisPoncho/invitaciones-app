"""
SQLAlchemy ORM models.
Complex JSON fields (theme, photoConfigs, sections, etc.) are stored as TEXT
columns containing JSON strings — no need for individual column queries on them.
"""

from __future__ import annotations

from datetime import datetime, timezone

# pyrefly: ignore [missing-import]
from sqlalchemy import ForeignKey
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Mapped, mapped_column, relationship

try:
    from database import Base
except ImportError:
    from .database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Invitation(Base):
    __tablename__ = "invitations"

    id: Mapped[str] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(unique=True, nullable=False, index=True)
    anfitriones: Mapped[str] = mapped_column(nullable=False)
    fecha_iso: Mapped[str] = mapped_column(nullable=False)
    fecha_legible: Mapped[str] = mapped_column(nullable=False, default="")
    lugar_nombre: Mapped[str] = mapped_column(nullable=False, default="")
    lugar_direccion: Mapped[str] = mapped_column(nullable=False, default="")
    lugar_direccion_url: Mapped[str | None] = mapped_column(nullable=True)
    ceremonia_hora: Mapped[str | None] = mapped_column(nullable=True, default="")
    ceremonia_lugar: Mapped[str | None] = mapped_column(nullable=True, default="")
    ceremonia_direccion: Mapped[str | None] = mapped_column(nullable=True, default="")
    ceremonia_url: Mapped[str | None] = mapped_column(nullable=True, default="")
    recepcion_hora: Mapped[str | None] = mapped_column(nullable=True, default="")
    recepcion_lugar: Mapped[str | None] = mapped_column(nullable=True, default="")
    recepcion_direccion: Mapped[str | None] = mapped_column(nullable=True, default="")
    recepcion_url: Mapped[str | None] = mapped_column(nullable=True, default="")
    mensaje: Mapped[str] = mapped_column(nullable=False, default="")
    fotos: Mapped[str] = mapped_column(nullable=False, default="[]")
    theme: Mapped[str] = mapped_column(nullable=False)
    admin_token: Mapped[str] = mapped_column(unique=True, nullable=False, index=True)
    entry_animation: Mapped[str] = mapped_column(nullable=False, default="carta")
    photo_configs: Mapped[str] = mapped_column(nullable=False, default="[]")
    free_elements: Mapped[str] = mapped_column(nullable=False, default="[]")
    sections: Mapped[str] = mapped_column(nullable=False, default="[]")
    style_preset: Mapped[str] = mapped_column(nullable=False, default="clasico")
    itinerary: Mapped[str] = mapped_column(nullable=False, default="[]")
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(nullable=False, default=_utcnow, onupdate=_utcnow)

    rsvps: Mapped[list[Rsvp]] = relationship(
        back_populates="invitation", cascade="all, delete-orphan"
    )


class Rsvp(Base):
    __tablename__ = "rsvps"

    id: Mapped[str] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(nullable=False)
    asistencia: Mapped[str] = mapped_column(nullable=False)
    pases: Mapped[int] = mapped_column(nullable=False, default=1)
    created_at: Mapped[datetime] = mapped_column(nullable=False, default=_utcnow)

    invitation_id: Mapped[str] = mapped_column(
        ForeignKey("invitations.id", ondelete="CASCADE"), nullable=False
    )
    invitation: Mapped[Invitation] = relationship(back_populates="rsvps")
