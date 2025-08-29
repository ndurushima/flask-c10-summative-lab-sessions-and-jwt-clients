from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, create_access_token, create_refresh_token
from ..schemas.schemas import RegisterSchema, LoginSchema, UserSchema 
from ..models.models import User, TokenBlockList
from ..extensions import db

auth_bp = Blueprint('auth', __name__)

register_schema = RegisterSchema()
login_schema = LoginSchema()
user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    payload = register_schema.load(request.get_json() or {})
    print (payload)

    user = User(username=payload ["username"])
    user.password = payload["password"]

    db. session.add(user) 
    db.session.commit()

    access = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)
    return jsonify(user=user_schema.dump(user), access_token=access, refresh_token=refresh), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    payload = login_schema.load(request.get_json() or {})
    user = User.query.filter_by(username=payload["username"]).first()
    if not user or not user.check_password(payload["password"]):
        return jsonify(msg="Invalid username or password"), 401

    access = create_access_token(identity=user.id)
    refresh = create_refresh_token(identity=user.id)
    return jsonify(user=user_schema.dump(user), access_token=access, refresh_token=refresh), 200

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