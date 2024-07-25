from flask import Flask, session, redirect
from flask_login import LoginManager, current_user, logout_user
from db.login_trab import get_user_by_username
from datetime import datetime, timedelta

from functools import wraps
from flask import abort

app = Flask(__name__)
app.config['SECRET_KEY'] = 'gato'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30) 

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return get_user_by_username(user_id)

@app.before_request
def make_session_permanent():
    session.permanent = True
    session.modified = True


def admin_requerido(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        # Verificar si el usuario está autenticado y es administrador
        if not current_user.is_authenticated or not current_user.is_admin():
            return render_template('autorizado.html'), 403
        return func(*args, **kwargs)
    return decorated_view


from routes.routes import *

if __name__ == '__main__':
    app.run(debug=True)
