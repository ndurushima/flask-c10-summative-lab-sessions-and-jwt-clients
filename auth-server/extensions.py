from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

@jwt.token_in_blocklist_loader
def is_token_revoked(jwt_header, jwt_payload):
    from models.models import TokenBlocklist  # avoid circular import
    jti = jwt_payload.get("jti")
    if not jti:
        return False
    exists = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return exists is not None
