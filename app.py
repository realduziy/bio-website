from flask import Flask, render_template
from flask_talisman import Talisman
import keyboard
import subprocess
import sys
import os
import random

app = Flask(__name__)
talisman = Talisman(
    app,
    force_https=False,  # Disable HTTPS redirection for local testing
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
            "data:"  # Allow data URIs for inline images
        ],
        'media-src': "'self'",
        'frame-src': "https://www.youtube.com",
        'font-src': [
            "'self'",
            "https://cdnjs.cloudflare.com",
            "https://stackpath.bootstrapcdn.com"  # Add Font Awesome CDN
        ]
    }
)

def get_random_background():
    # Get a list of all background video files
    backgrounds_dir = os.path.join('static', 'backgrounds')
    background_files = [f for f in os.listdir(backgrounds_dir) if f.endswith('.mp4')]

    # Select a random background video
    if background_files:
        return random.choice(background_files)
    else:
        return None

@app.route("/")
def home():
    name = "duziy"
    statuses = ["Music is life!", "Peace and love!"]
    background_video = get_random_background()
    return render_template("index.html", name=name, statuses=statuses, background_video=background_video)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

def clear_console():
    # Clear the console
    os.system('cls' if os.name == 'nt' else 'clear')

def restart_server():
    # Clear the console
    clear_console()
    # Restart the server
    subprocess.Popen([sys.executable] + sys.argv)
    sys.exit()

def start_server():
    # Start the server
    app.run(debug=False)

if __name__ == "__main__":
    # Register the hotkey
    keyboard.add_hotkey('ctrl+r', restart_server)

    # Start the server
    start_server()
