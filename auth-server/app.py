from flask import Flask, jsonify
from extensions import db, bcrypt, jwt, migrate
from routes.auth import auth_bp
from routes.user import user_bp
from config import config

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    # init extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(user_bp)

    @app.get("/")
    def root():
        return jsonify(ok=True)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(port=5555, debug=app.config.get("DEBUG", False))

