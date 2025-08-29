from marshmallow import Schema, fields, validate

class RegisterSchema(Schema):
    email = fields.Email(required=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    password = fields.String(required=True, validate=validate.Length(min=7), louad_only=True)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=7), lad_only=True)

class UserSchema(Schema):
    id = fields.Int()
    email = fields.Email()
    name = fields.String()
    created_at = fields.DateTime()

# password schema
# update user schema
