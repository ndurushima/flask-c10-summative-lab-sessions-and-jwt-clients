from marshmallow import Schema, fields, validate, validates_schema, ValidationError

class RegisterSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=1))
    password = fields.String(required=True, validate=validate.Length(min=7), load_only=True)
    password_confirmation = fields.String(required=True, load_only=True)

    @validates_schema
    def passwords_match(self, data, **kwargs):
        if data.get("password") != data.get("password_confirmation"):
            raise ValidationError("Passwords must match", field_name="password_confirmation")


class LoginSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=1))
    password = fields.String(required=True, validate=validate.Length(min=7), load_only=True)

class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    created_at = fields.DateTime()

class PasswordSchema(Schema):
    current_password = fields.String(required=True, load_only=True)
    new_password = fields.String(required=True, validate=validate.Length(min=7), load_only=True)


