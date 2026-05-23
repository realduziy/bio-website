```markdown
# Project Overview

This project is a proof-of-concept built using AI. While it is fully functional, it is intended for demonstration purposes. If you plan to deploy this for production, I recommend forking the repository to address potential bugs and enhance security measures.

---

## Technical Requirements

| Component | Requirement |
| :--- | :--- |
| **Language** | Python 3.x |
| **Framework** | Flask (`pip install Flask`) |
| **Server** | Gunicorn (`pip install gunicorn`) |
| **Media Assets** | `profile.jpg`, `background.mp4`, `background_music.mp3`, `favicon.ico`, `crosshair.png` |

---

## Setup Guide

1. **Prepare Assets:** Place your files into the `/assets` folder. You can customize the following:
    * **Profile Picture:** Name it `profile.jpg`.
    * **Background:** Name the video `background.mp4` and the audio `background_music.mp3`.
    * **Branding:** Replace `favicon.ico` for your browser tab icon and `crosshair.png` to update your custom cursor/crosshair.
    * *Note: Feel free to swap out any other supporting images or files in this folder to match your theme.*

2. **Customize Content:** Open the HTML files to update your personal details, including your social media links, name, bio, and website title.

---

## Deployment & Execution

### 🐳 Running with Docker & Gunicorn (Recommended for VPS)

Using Docker with Gunicorn is the most robust way to host this app on a VPS. It isolates the environment and ensures the app can handle multiple requests efficiently.

**1. Create a `requirements.txt` file:**
In the root directory of the project, create a file named `requirements.txt` and add the following:
```text
Flask==3.0.0
gunicorn==21.2.0

```

**2. Create a `Dockerfile`:**
In the same directory, create a file named `Dockerfile` (no extension) and paste this configuration:

```dockerfile
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application, including the assets folder
COPY . .

# Expose the port Gunicorn will run on
EXPOSE 5000

# Run Gunicorn with 4 workers, binding to 0.0.0.0
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]

```

**3. Build and Run the Container:**
Run these commands in your VPS terminal:

```bash
# Build the Docker image (don't miss the dot at the end)
docker build -t flask-portfolio .

# Run the container in the background (mapping port 80 to 5000)
docker run -d -p 80:5000 --name my-flask-app flask-portfolio

```

### ⚠️ Common Docker/Gunicorn Troubleshooting

If you run into issues getting this setup to work, here is how to fix the most common problems:

* **Site isn't loading outside the VPS:** This usually happens if Gunicorn binds to `127.0.0.1` instead of `0.0.0.0`. The Dockerfile provided above fixes this by explicitly setting `-b 0.0.0.0:5000`. Docker cannot route traffic to the container if it's only listening locally.
* **Missing Assets (Images/Video not showing):** Ensure that your `/assets` folder is actually in the same directory as the Dockerfile before building. The `COPY . .` command brings everything over, but if the folder is missing or misnamed on the host, the container won't have it.
* **"Module not found: app" Error:** The Gunicorn command `app:app` assumes your main Python script is named `app.py` and the Flask instance inside it is called `app`. If you named your file `main.py`, you need to change the CMD line in the Dockerfile to `CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app"]`.

### Running Locally (For Testing)

To test the project on your machine before using Docker, navigate to the project directory in your terminal and run:

```bash
# 1. Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install Flask
pip install Flask

# 3. Run the app
python app.py

```

*(If that fails on Windows, try `py app.py`)*

---

## Project Preview

```
<img width="1914" height="910" alt="image" src="https://github.com/user-attachments/assets/d816fec7-8b9c-4b1d-a920-bd9942a98600" />

```
