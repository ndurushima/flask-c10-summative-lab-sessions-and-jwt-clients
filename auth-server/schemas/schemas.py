from marshmallow import Schema, fields, validate

class RegisterSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=1))
    password = fields.String(required=True, validate=validate.Length(min=7), load_only=True)
    password_confirmation = fields.String(required=True, load_only=True)

class LoginSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=1))
    password = fields.String(required=True, validate=validate.Length(min=7), load_only=True)

class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    created_at = fields.DateTime()

class PasswordSchema(Schema):
    pass

# password schema
# update user schema
