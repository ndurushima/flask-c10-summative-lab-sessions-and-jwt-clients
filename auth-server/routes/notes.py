from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.models import Note
from schemas.schemas import NoteSchema, NoteCreateSchema

notes_bp = Blueprint("notes", __name__, url_prefix="/notes")

note_schema = NoteSchema()
notes_schema = NoteSchema(many=True)
note_create_schema = NoteCreateSchema()

def _query_user_notes(uid):
    return Note.query.filter_by(user_id=uid)

@notes_bp.get("")
@jwt_required()
def index_notes():
    uid = get_jwt_identity()

    # pagination params
    try:
        page = int(request.args.get("page", 1))
        per_page = min(int(request.args.get("per_page", 5)), 50)
    except ValueError:
        return jsonify(msg="Invalid pagination params"), 400

    q = _query_user_notes(uid).order_by(Note.created_at.desc())
    total = q.count()
    items = q.offset((page - 1) * per_page).limit(per_page).all()

    return jsonify(
        page=page,
        per_page=per_page,
        total=total,
        items=notes_schema.dump(items),
    ), 200

@notes_bp.post("")
@jwt_required()
def create_note():
    uid = get_jwt_identity()
    data = note_create_schema.load(request.get_json() or {})
    note = Note(title=data["title"], content=data["content"], user_id=uid)
    db.session.add(note)
    db.session.commit()
    return jsonify(note=note_schema.dump(note)), 201

@notes_bp.patch("/<int:note_id>")
@jwt_required()
def update_note(note_id):
    uid = get_jwt_identity()
    note = _query_user_notes(uid).filter_by(id=note_id).first()
    if not note:
        return jsonify(msg="Not found"), 404

    payload = request.get_json() or {}
    if "title" in payload:
        if not isinstance(payload["title"], str) or not payload["title"].strip():
            return jsonify(msg="Invalid title"), 400
        note.title = payload["title"].strip()
    if "content" in payload:
        if not isinstance(payload["content"], str) or not payload["content"].strip():
            return jsonify(msg="Invalid content"), 400
        note.content = payload["content"].strip()

    db.session.commit()
    return jsonify(note=note_schema.dump(note)), 200

@notes_bp.delete("/<int:note_id>")
@jwt_required()
def delete_note(note_id):
    uid = get_jwt_identity()
    note = _query_user_notes(uid).filter_by(id=note_id).first()
    if not note:
        return jsonify(msg="Not found"), 404
    db.session.delete(note)
    db.session.commit()
    return jsonify(msg="Deleted"), 200
