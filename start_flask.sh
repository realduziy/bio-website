#!/bin/bash
cd /home/website/web
source venv/bin/activate
screen -dmS flask_app gunicorn -w 4 -b 0.0.0.0:8000 app:app --access-logfile gunicorn_access.log --error-logfile gunicorn_error.log
echo "Flask app started in a screen session named 'flask_app'."
echo "View logs with: tail -f /home/website/web/gunicorn_access.log"
echo "Attach to screen with: screen -r flask_app"