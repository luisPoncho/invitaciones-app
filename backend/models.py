"""
SQLAlchemy ORM models.
Complex JSON fields (theme, photoConfigs, sections, etc.) are stored as TEXT
columns containing JSON strings — no need for individual column queries on them.
"""

from datetime import datetime, timezone

# pyrefly: ignore [missing-import]
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship

try:
    from database import Base
except ImportError:
    from .database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(String, primary_key=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    anfitriones = Column(String, nullable=False)
    fecha_iso = Column(String, nullable=False)
    fecha_legible = Column(String, nullable=False, default="")
    lugar_nombre = Column(String, nullable=False, default="")
    lugar_direccion = Column(String, nullable=False, default="")
    lugar_direccion_url = Column(String, nullable=True)
    mensaje = Column(Text, nullable=False, default="")
    fotos = Column(Text, nullable=False, default="[]")  # JSON array of strings
    theme = Column(Text, nullable=False)  # JSON InvitationTheme
    admin_token = Column(String, unique=True, nullable=False, index=True)
    entry_animation = Column(String, nullable=False, default="carta")
    photo_configs = Column(Text, nullable=False, default="[]")  # JSON PhotoConfig[]
    free_elements = Column(Text, nullable=False, default="[]")  # JSON FreeElement[]
    sections = Column(Text, nullable=False, default="[]")  # JSON SectionBlock[]
    created_at = Column(DateTime, nullable=False, default=_utcnow)
    updated_at = Column(DateTime, nullable=False, default=_utcnow, onupdate=_utcnow)

    rsvps = relationship("Rsvp", back_populates="invitation", cascade="all, delete-orphan")


class Rsvp(Base):
    __tablename__ = "rsvps"

    id = Column(String, primary_key=True)
    nombre = Column(String, nullable=False)
    asistencia = Column(String, nullable=False)  # "si" | "no"
    created_at = Column(DateTime, nullable=False, default=_utcnow)

    invitation_id = Column(String, ForeignKey("invitations.id", ondelete="CASCADE"), nullable=False)
    invitation = relationship("Invitation", back_populates="rsvps")
