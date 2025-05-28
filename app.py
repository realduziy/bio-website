from flask import Flask, render_template, url_for
from flask_talisman import Talisman
import os
import random

app = Flask(__name__)

Talisman(
    app,
    force_https=False,
    content_security_policy={
        'default-src': "'self'",
        'style-src': [
            "'self'",
            "https://cdnjs.cloudflare.com",
            "'unsafe-inline'"
        ],
        'script-src': [
            "'self'",
            "'unsafe-inline'"
        ],
        'img-src': [
            "'self'",
            "https://*.wikimedia.org",
            "https://icons8.com",
            "https://img.icons8.com",
            "https://s.namemc.com",
            "data:"
        ],
        'media-src': "'self'",
        'frame-src': "https://www.youtube.com",
        'font-src': [
            "'self'",
            "https://cdnjs.cloudflare.com",
            "https://stackpath.bootstrapcdn.com"
        ]
    }
)

def get_random_background():
    backgrounds_dir = os.path.join(app.static_folder, 'backgrounds')
    try:
        background_files = [
            f for f in os.listdir(backgrounds_dir)
            if f.endswith('.mp4')
        ]
        return random.choice(background_files) if background_files else None
    except FileNotFoundError:
        return None

@app.route("/")
def home():
    name = "duziy"
    statuses = ["Music is life!", "Peace and love!"]
    background_video = get_random_background()
    return render_template(
        "index.html",
        name=name,
        statuses=statuses,
        background_video=background_video
    )

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(error):
    return render_template('500.html'), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
