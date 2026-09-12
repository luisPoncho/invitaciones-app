"""
FastAPI backend for invitaciones-app.

Run with:
    cd backend && uvicorn main:app --reload --port 8000
"""

import json
import secrets
import string
from datetime import datetime, timezone

from contextlib import asynccontextmanager
from typing import Any, List, Optional, cast

# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends, HTTPException, Query
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

try:
    from database import engine, get_db, Base, SessionLocal
    from models import Invitation, Rsvp
    from schemas import (
        InvitationCreate,
        InvitationUpdate,
        InvitationResponse,
        RsvpCreate,
        RsvpResponse,
    )
except ImportError:
    from .database import engine, get_db, Base, SessionLocal
    from .models import Invitation, Rsvp
    from .schemas import (
        InvitationCreate,
        InvitationUpdate,
        InvitationResponse,
        RsvpCreate,
        RsvpResponse,
    )


# ── Create tables ────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)


def auto_migrate_db():
    """Ensure all new columns exist in the invitations table."""

    from sqlalchemy import inspect, text

    try:
        inspector = inspect(engine)

        # Get existing columns from SQLite or PostgreSQL
        columns = inspector.get_columns("invitations")
        existing_cols = {column["name"] for column in columns}

        new_cols = [
            ("ceremonia_hora", "TEXT DEFAULT ''"),
            ("ceremonia_lugar", "TEXT DEFAULT ''"),
            ("ceremonia_direccion", "TEXT DEFAULT ''"),
            ("ceremonia_url", "TEXT DEFAULT NULL"),
            ("recepcion_hora", "TEXT DEFAULT ''"),
            ("recepcion_lugar", "TEXT DEFAULT ''"),
            ("recepcion_direccion", "TEXT DEFAULT ''"),
            ("recepcion_url", "TEXT DEFAULT NULL"),
        ]

        with engine.begin() as connection:
            for col_name, col_type in new_cols:
                if col_name not in existing_cols:
                    connection.execute(
                        text(
                            f"ALTER TABLE invitations "
                            f"ADD COLUMN {col_name} {col_type}"
                        )
                    )

        print("Database migration check completed.")

    except Exception as e:
        print("Migration check notice:", e)


def seed_db():
    db: Session = SessionLocal()
    try:
        if db.query(Invitation).filter(Invitation.slug == "sofia-y-mateo").first() is None:
            now = datetime.now(timezone.utc)
            inv = Invitation(
                id=_generate_id(),
                slug="sofia-y-mateo",
                anfitriones="Sofía & Mateo",
                fecha_iso="2026-11-14T18:00:00",
                fecha_legible="14 de noviembre, 2026",
                lugar_nombre="Hacienda Los Encinos",
                lugar_direccion="Camino a San Isidro 450, Tepatitlán de Morelos, Jal.",
                lugar_direccion_url=None,
                ceremonia_hora="4:00 PM",
                ceremonia_lugar="Parroquia de San José",
                ceremonia_direccion="Av. Hidalgo #123, Centro Histórico",
                ceremonia_url="https://maps.google.com/?q=Parroquia+San+Jose",
                recepcion_hora="7:00 PM",
                recepcion_lugar="Hacienda Los Encinos",
                recepcion_direccion="Camino a San Isidro 450, Tepatitlán de Morelos, Jal.",
                recepcion_url="https://maps.google.com/?q=Hacienda+Los+Encinos",
                mensaje="Con el corazón lleno de alegría, queremos que nos acompañes a celebrar el inicio de esta nueva etapa.",
                fotos=json.dumps([
                    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
                    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800",
                    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800",
                ]),
                theme=json.dumps({
                    "primary": "#22342A",
                    "secondary": "#182620",
                    "paper": "#F4EFE4",
                    "accent": "#B08D3F",
                    "accentLight": "#D9C48B",
                    "fontDisplay": "fraunces",
                    "fontBody": "work-sans",
                }),
                admin_token="demo-token-123",
                entry_animation="carta",
                photo_configs=json.dumps([]),
                free_elements=json.dumps([]),
                sections=json.dumps([
                    {"id": "sec-1", "type": "portada"},
                    {"id": "sec-2", "type": "cuenta-regresiva"},
                    {"id": "sec-3", "type": "fecha-lugar"},
                    {"id": "sec-4", "type": "galeria"},
                    {"id": "sec-5", "type": "rsvp"},
                ]),
                created_at=now,
                updated_at=now,
            )
            db.add(inv)
            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    auto_migrate_db()
    seed_db()
    yield


# pyrefly: ignore [missing-import]
from starlette.middleware.base import BaseHTTPMiddleware
# pyrefly: ignore [missing-import]
from starlette.responses import Response


class CustomCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        origin = request.headers.get("origin") or "*"
        if request.method == "OPTIONS":
            response = Response(status_code=200)
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = request.headers.get("access-control-request-headers", "*")
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response

        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response


# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(title="Invitaciones API", version="1.0.0", lifespan=lifespan)

app.add_middleware(CustomCORSMiddleware)



# ── Helpers ──────────────────────────────────────────────────────────────────

def _generate_id() -> str:
    """Generate a short random ID (cuid-like)."""
    chars = string.ascii_lowercase + string.digits
    return "".join(secrets.choice(chars) for _ in range(24))


def _generate_admin_token() -> str:
    chars = string.ascii_lowercase + string.digits
    return "".join(secrets.choice(chars) for _ in range(24))


def _safe_json_loads(data: Any, default: Any):
    if not data:
        return default
    try:
        return json.loads(data)
    except Exception:
        return default


def _invitation_to_response(inv: Invitation) -> InvitationResponse:
    """Convert a SQLAlchemy Invitation row to the API response schema."""
    return InvitationResponse(
        slug=cast(str, inv.slug),
        anfitriones=cast(str, inv.anfitriones),
        fechaISO=cast(str, inv.fecha_iso),
        fechaLegible=cast(str, getattr(inv, "fecha_legible", "") or ""),
        lugarNombre=cast(str, getattr(inv, "lugar_nombre", "") or ""),
        lugarDireccion=cast(str, getattr(inv, "lugar_direccion", "") or ""),
        lugarDireccionUrl=cast(Optional[str], getattr(inv, "lugar_direccion_url", None)),
        ceremoniaHora=cast(Optional[str], getattr(inv, "ceremonia_hora", "") or ""),
        ceremoniaLugar=cast(Optional[str], getattr(inv, "ceremonia_lugar", "") or ""),
        ceremoniaDireccion=cast(Optional[str], getattr(inv, "ceremonia_direccion", "") or ""),
        ceremoniaUrl=cast(Optional[str], getattr(inv, "ceremonia_url", None)),
        recepcionHora=cast(Optional[str], getattr(inv, "recepcion_hora", "") or ""),
        recepcionLugar=cast(Optional[str], getattr(inv, "recepcion_lugar", "") or ""),
        recepcionDireccion=cast(Optional[str], getattr(inv, "recepcion_direccion", "") or ""),
        recepcionUrl=cast(Optional[str], getattr(inv, "recepcion_url", None)),
        mensaje=cast(str, getattr(inv, "mensaje", "") or ""),
        fotos=_safe_json_loads(getattr(inv, "fotos", "[]"), []),
        theme=_safe_json_loads(getattr(inv, "theme", "{}"), {}),
        adminToken=cast(str, getattr(inv, "admin_token", "") or ""),
        entryAnimation=cast(str, getattr(inv, "entry_animation", "carta") or "carta"),
        photoConfigs=_safe_json_loads(getattr(inv, "photo_configs", "[]"), []),
        freeElements=_safe_json_loads(getattr(inv, "free_elements", "[]"), []),
        sections=_safe_json_loads(getattr(inv, "sections", "[]"), []),
        createdAt=inv.created_at.isoformat() if getattr(inv, "created_at", None) else "",
        updatedAt=inv.updated_at.isoformat() if getattr(inv, "updated_at", None) else "",
    )



# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  INVITATIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.get("/api/invitations", response_model=List[InvitationResponse])
def list_invitations(db: Session = Depends(get_db)):
    """List all invitations, newest first."""
    rows = db.query(Invitation).order_by(Invitation.updated_at.desc()).all()
    return [_invitation_to_response(r) for r in rows]


@app.post("/api/invitations", response_model=InvitationResponse, status_code=201)
def create_invitation(body: InvitationCreate, db: Session = Depends(get_db)):
    """Create a new invitation."""
    # Check for slug collision
    existing = db.query(Invitation).filter(Invitation.slug == body.slug).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"El slug '{body.slug}' ya está en uso.")

    now = datetime.now(timezone.utc)
    inv = Invitation(
        id=_generate_id(),
        slug=body.slug,
        anfitriones=body.anfitriones,
        fecha_iso=body.fechaISO,
        fecha_legible=body.fechaLegible,
        lugar_nombre=body.lugarNombre,
        lugar_direccion=body.lugarDireccion,
        lugar_direccion_url=body.lugarDireccionUrl,
        ceremonia_hora=body.ceremoniaHora,
        ceremonia_lugar=body.ceremoniaLugar,
        ceremonia_direccion=body.ceremoniaDireccion,
        ceremonia_url=body.ceremoniaUrl,
        recepcion_hora=body.recepcionHora,
        recepcion_lugar=body.recepcionLugar,
        recepcion_direccion=body.recepcionDireccion,
        recepcion_url=body.recepcionUrl,
        mensaje=body.mensaje,
        fotos=json.dumps(body.fotos),
        theme=json.dumps(body.theme.model_dump()),
        admin_token=body.adminToken or _generate_admin_token(),
        entry_animation=body.entryAnimation,
        photo_configs=json.dumps([pc.model_dump() for pc in body.photoConfigs]),
        free_elements=json.dumps([fe.model_dump() for fe in body.freeElements]),
        sections=json.dumps([s.model_dump() for s in body.sections]),
        created_at=now,
        updated_at=now,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return _invitation_to_response(inv)


@app.get("/api/invitations/{slug}", response_model=InvitationResponse)
def get_invitation(slug: str, db: Session = Depends(get_db)):
    """Get a single invitation by slug (public — used to render the invitation page)."""
    inv = db.query(Invitation).filter(Invitation.slug == slug).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitación no encontrada.")
    return _invitation_to_response(inv)


@app.put("/api/invitations/{slug}", response_model=InvitationResponse)
def update_invitation(slug: str, body: InvitationUpdate, db: Session = Depends(get_db)):
    """Update an existing invitation. Requires adminToken for authorization."""
    inv = db.query(Invitation).filter(Invitation.slug == slug).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitación no encontrada.")

    # Verify admin token
    if inv.admin_token != body.adminToken:
        raise HTTPException(status_code=403, detail="Token de administrador inválido.")

    # Handle slug rename
    if body.slug is not None and body.slug != slug:
        collision = db.query(Invitation).filter(Invitation.slug == body.slug).first()
        if collision:
            raise HTTPException(status_code=409, detail=f"El slug '{body.slug}' ya está en uso.")
        inv.slug = body.slug

    # Update scalar fields
    if body.anfitriones is not None:
        inv.anfitriones = body.anfitriones
    if body.fechaISO is not None:
        inv.fecha_iso = body.fechaISO
    if body.fechaLegible is not None:
        inv.fecha_legible = body.fechaLegible
    if body.lugarNombre is not None:
        inv.lugar_nombre = body.lugarNombre
    if body.lugarDireccion is not None:
        inv.lugar_direccion = body.lugarDireccion
    if body.lugarDireccionUrl is not None:
        inv.lugar_direccion_url = body.lugarDireccionUrl
    if body.ceremoniaHora is not None:
        inv.ceremonia_hora = body.ceremoniaHora
    if body.ceremoniaLugar is not None:
        inv.ceremonia_lugar = body.ceremoniaLugar
    if body.ceremoniaDireccion is not None:
        inv.ceremonia_direccion = body.ceremoniaDireccion
    if body.ceremoniaUrl is not None:
        inv.ceremonia_url = body.ceremoniaUrl
    if body.recepcionHora is not None:
        inv.recepcion_hora = body.recepcionHora
    if body.recepcionLugar is not None:
        inv.recepcion_lugar = body.recepcionLugar
    if body.recepcionDireccion is not None:
        inv.recepcion_direccion = body.recepcionDireccion
    if body.recepcionUrl is not None:
        inv.recepcion_url = body.recepcionUrl
    if body.mensaje is not None:
        inv.mensaje = body.mensaje
    if body.entryAnimation is not None:
        inv.entry_animation = body.entryAnimation

    # Update JSON fields
    if body.fotos is not None:
        inv.fotos = json.dumps(body.fotos)
    if body.theme is not None:
        inv.theme = json.dumps(body.theme.model_dump())
    if body.photoConfigs is not None:
        inv.photo_configs = json.dumps([pc.model_dump() for pc in body.photoConfigs])
    if body.freeElements is not None:
        inv.free_elements = json.dumps([fe.model_dump() for fe in body.freeElements])
    if body.sections is not None:
        inv.sections = json.dumps([s.model_dump() for s in body.sections])

    inv.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(inv)
    return _invitation_to_response(inv)


@app.delete("/api/invitations/{slug}", status_code=204)
def delete_invitation(
    slug: str,
    token: str = Query(..., description="Admin token for authorization"),
    db: Session = Depends(get_db),
):
    """Delete an invitation. Requires adminToken as query param."""
    inv = db.query(Invitation).filter(Invitation.slug == slug).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitación no encontrada.")
    if inv.admin_token != token:
        raise HTTPException(status_code=403, detail="Token de administrador inválido.")

    db.delete(inv)
    db.commit()
    return None


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  RSVP
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.get("/api/invitations/{slug}/rsvp", response_model=List[RsvpResponse])
def list_rsvps(
    slug: str,
    token: str = Query(..., description="Admin token for authorization"),
    db: Session = Depends(get_db),
):
    """List all RSVPs for an invitation. Requires admin token."""
    inv = db.query(Invitation).filter(Invitation.slug == slug).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitación no encontrada.")
    if inv.admin_token != token:
        raise HTTPException(status_code=403, detail="Token de administrador inválido.")

    return [
        RsvpResponse(
            nombre=r.nombre,
            asistencia=r.asistencia,
            timestamp=r.created_at.isoformat() if r.created_at else "",
        )
        for r in inv.rsvps
    ]


@app.post("/api/invitations/{slug}/rsvp", response_model=RsvpResponse, status_code=201)
def create_rsvp(slug: str, body: RsvpCreate, db: Session = Depends(get_db)):
    """Submit an RSVP response (public — any guest can submit)."""
    inv = db.query(Invitation).filter(Invitation.slug == slug).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitación no encontrada.")

    if body.asistencia not in ("si", "no"):
        raise HTTPException(status_code=422, detail="asistencia debe ser 'si' o 'no'.")

    now = datetime.now(timezone.utc)
    rsvp = Rsvp(
        id=_generate_id(),
        nombre=body.nombre.strip(),
        asistencia=body.asistencia,
        invitation_id=inv.id,
        created_at=now,
    )
    db.add(rsvp)
    db.commit()

    return RsvpResponse(
        # pyrefly: ignore [bad-argument-type]
        nombre=rsvp.nombre,
        # pyrefly: ignore [bad-argument-type]
        asistencia=rsvp.asistencia,
        timestamp=rsvp.created_at.isoformat(),
    )


# ── Health check ─────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok"}
