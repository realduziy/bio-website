from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    name = "duziy"  # Replace with the actual name
    statuses = ["Music is life!", "Peace and love!"]  # Your status messages
    return render_template("index.html", name=name, statuses=statuses)


if __name__ == "__main__":
    app.run()
