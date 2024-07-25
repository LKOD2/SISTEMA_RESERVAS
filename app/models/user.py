from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user

class User(UserMixin):
    def __init__(self, usuario, clave, role):
        self.id = usuario
        self.usuario = usuario
        self.clave = clave
        self.role = role
        
    def get_id(self):
        return self.id
    
    def is_admin(self):
        return self.role == 'admin'