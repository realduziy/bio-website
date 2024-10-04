from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")  # Render the index.html template

if __name__ == "__main__":
    app.run(debug=True)  # Enable debug mode for development
