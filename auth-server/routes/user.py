from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required, get_jwt
from schemas.schemas import UserSchema, PasswordSchema
from models.models import User, db

user_bp = Blueprint("users", __name__)

user_schema = UserSchema()

@user_bp.get("/me")
def get_users():
    uid = get_jwt_identity()
    user = User.query.get_or_404(uid)
    return jsonify(user=user_schema.dump(user)), 200

@user_bp.patch("/me")
@jwt_required()
def update_me():
    uid = get_jwt_identity()
    user = User.query.get_or_404(uid)
    payload = request.get_json() or {}

    # password update flow
    if "current_password" in payload or "new_password" in payload:
        # need to make pwd schema so we can change the password
        data = PasswordSchema.load(payload)
        if not user.check_password(data["current_password"]):
            return jsonify(msg="Current password is incorrect"), 400
        user.password = data["new_password"]
        db.session.committ()

        # remove current token
        # jti = get_jwt()["jti"]
        # db.session.add(TokenBlock List(jti=jti, user_id=uid))
        # db.session.committ()
        # return jsonify(msg="Password updated, please log in again"), 200
    
    # update profile infoflow
    data = data