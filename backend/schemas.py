"""
Pydantic schemas for request/response validation.
Uses camelCase aliases to match the existing TypeScript types exactly,
so the frontend doesn't need any field name mapping.
"""

from __future__ import annotations

from typing import Any, Optional, List

# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field



# ── Theme ────────────────────────────────────────────────────────────────────

class InvitationTheme(BaseModel):
    primary: str = "#22342A"
    secondary: str = "#182620"
    paper: str = "#F4EFE4"
    accent: str = "#B08D3F"
    accentLight: str = "#D9C48B"
    fontDisplay: Optional[str] = "fraunces"
    fontBody: Optional[str] = "work-sans"


# ── Section Block ────────────────────────────────────────────────────────────

class SectionBlock(BaseModel):
    id: str
    type: str
    bgUrl: Optional[str] = None
    bgScrollBehavior: Optional[str] = None
    bgPositionX: Optional[float] = None
    bgPositionY: Optional[float] = None
    bgZoom: Optional[float] = None
    giftRegistryUrl: Optional[str] = None
    giftRegistryTitle: Optional[str] = None
    customTitle: Optional[str] = None
    customBody: Optional[str] = None
    photoUrl: Optional[str] = None


# ── Photo Config ─────────────────────────────────────────────────────────────

class PhotoConfig(BaseModel):
    url: str = ""
    scrollBehavior: str = "normal"
    displayMode: str = "galeria"
    frameSize: Optional[str] = None
    framePosition: Optional[str] = None
    objectPosition: Optional[str] = None


# ── Free Element ─────────────────────────────────────────────────────────────

class FreeElement(BaseModel):
    id: str
    type: str
    content: Optional[str] = None
    url: Optional[str] = None
    x: float = 0
    y: float = 0
    color: Optional[str] = None
    fontSize: Optional[float] = None
    fontFamily: Optional[str] = None
    width: Optional[float] = None
    height: Optional[float] = None
    imageX: Optional[float] = None
    imageY: Optional[float] = None


# ── Invitation ───────────────────────────────────────────────────────────────

class InvitationCreate(BaseModel):
    """Body for POST /api/invitations"""
    slug: str
    anfitriones: str
    fechaISO: str
    fechaLegible: str = ""
    lugarNombre: str = ""
    lugarDireccion: str = ""
    lugarDireccionUrl: Optional[str] = None
    ceremoniaHora: Optional[str] = ""
    ceremoniaLugar: Optional[str] = ""
    ceremoniaDireccion: Optional[str] = ""
    ceremoniaUrl: Optional[str] = None
    recepcionHora: Optional[str] = ""
    recepcionLugar: Optional[str] = ""
    recepcionDireccion: Optional[str] = ""
    recepcionUrl: Optional[str] = None
    mensaje: str = ""
    fotos: List[str] = []
    theme: InvitationTheme = Field(default_factory=InvitationTheme)
    adminToken: str = ""
    entryAnimation: str = "carta"
    photoConfigs: List[PhotoConfig] = []
    freeElements: List[FreeElement] = []
    sections: List[SectionBlock] = []


class InvitationUpdate(BaseModel):
    """Body for PUT /api/invitations/{slug}"""
    slug: Optional[str] = None  # Allow slug rename
    anfitriones: Optional[str] = None
    fechaISO: Optional[str] = None
    fechaLegible: Optional[str] = None
    lugarNombre: Optional[str] = None
    lugarDireccion: Optional[str] = None
    lugarDireccionUrl: Optional[str] = None
    ceremoniaHora: Optional[str] = None
    ceremoniaLugar: Optional[str] = None
    ceremoniaDireccion: Optional[str] = None
    ceremoniaUrl: Optional[str] = None
    recepcionHora: Optional[str] = None
    recepcionLugar: Optional[str] = None
    recepcionDireccion: Optional[str] = None
    recepcionUrl: Optional[str] = None
    mensaje: Optional[str] = None
    fotos: Optional[List[str]] = None
    theme: Optional[InvitationTheme] = None
    adminToken: str  # Required for authorization
    entryAnimation: Optional[str] = None
    photoConfigs: Optional[List[PhotoConfig]] = None
    freeElements: Optional[List[FreeElement]] = None
    sections: Optional[List[SectionBlock]] = None


class InvitationResponse(BaseModel):
    """Response shape — matches FullInvitationConfig in TypeScript"""
    slug: str
    anfitriones: str
    fechaISO: str
    fechaLegible: str
    lugarNombre: str
    lugarDireccion: str
    lugarDireccionUrl: Optional[str] = None
    ceremoniaHora: Optional[str] = ""
    ceremoniaLugar: Optional[str] = ""
    ceremoniaDireccion: Optional[str] = ""
    ceremoniaUrl: Optional[str] = None
    recepcionHora: Optional[str] = ""
    recepcionLugar: Optional[str] = ""
    recepcionDireccion: Optional[str] = ""
    recepcionUrl: Optional[str] = None
    mensaje: str
    fotos: List[str]
    theme: InvitationTheme
    adminToken: str
    entryAnimation: str
    photoConfigs: List[PhotoConfig]
    freeElements: List[FreeElement]
    sections: List[SectionBlock]
    createdAt: str
    updatedAt: str


# ── RSVP ─────────────────────────────────────────────────────────────────────

class RsvpCreate(BaseModel):
    """Body for POST /api/invitations/{slug}/rsvp"""
    nombre: str
    asistencia: str  # "si" | "no"


class RsvpResponse(BaseModel):
    nombre: str
    asistencia: str
    timestamp: str
