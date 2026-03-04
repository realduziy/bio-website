from flask import Flask, send_file, send_from_directory, render_template_string
import os

app = Flask(__name__, static_folder='assets')

# Serve assets
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

# Serve main pages
@app.route('/')
def index():
    return send_file('index.html')

@app.route('/about')
def about():
    return send_file('about.html')

# Serve other files
@app.route('/<path:filename>')
def serve_file(filename):
    if filename in ['style.css', 'script.js']:
        return send_file(filename)
    elif filename == 'favicon.ico':
        return send_from_directory('assets', filename)
    return render_template_string('<h1>404</h1>'), 404

if __name__ == '__main__':
    print("Starting on http://0.0.0.0:8000")
    app.run(host='0.0.0.0', port=8000, debug=False)