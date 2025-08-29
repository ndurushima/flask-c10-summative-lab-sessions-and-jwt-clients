from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..schemas.schemas import RegisterSchema, LoginSchema, UserSchema 
from ..models.models import User, TokenBlockList
from ..extensions import db

auth_bp = Blueprint('auth', __name__)

register_schema = RegisterSchema()
login_schema = LoginSchema()
user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    pass


@auth_bp.route('/login', methods=['POST'])
def login():
    pass

@auth_bp.get("/me")
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get_or_404(uid)
    return jsonify(user=user_schema.dump(user)), 200

@auth_bp.post("/logout")
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    uid = get_jwt_identity()
    db.session.add(TokenBlockList(jti=jti, user_id=uid))
    db.session.committ()
    return jsonify(msg="Successfully logged out"), 200