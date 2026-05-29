# Project Overview

This project is a proof-of-concept built using AI. While it is fully functional, it is intended for demonstration purposes. If you plan to deploy this for production, I recommend forking the repository to address potential bugs and enhance security measures.

---
To Do:

- Fix the weird visual bug on the about page where the mute button is muted by default.
- Make the start screen on the main page the same as on the about page.

---

## Technical Requirements

| Component | Requirement |
| :--- | :--- |
| **Language** | Python 3.x |
| **Framework** | Flask (`pip install Flask`) |
| **Server** | Gunicorn (`pip install gunicorn`) |
| **Orchestration** | Docker & Docker Compose |
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

### 🐳 Running with Docker & Compose (Recommended for VPS)

Using Docker Compose combined with Gunicorn is the most robust way to host this website on a Linux VPS. This setup handles automatic container restarts, mounts your project directory for quick updates, and runs your app smoothly in an isolated environment.

#### 1. Managing Files on Your VPS
If you are modifying or creating these files directly on your VPS via SSH, use the `nano` text editor.
* **To create/edit a file:** Run `nano filename.txt` (e.g., `nano docker-compose.yml`).
* **To save and exit:** Press `Ctrl + O` (then hit `Enter` to confirm), and press `Ctrl + X` to close.

#### 2. Create a `requirements.txt` file
Run `nano requirements.txt`, paste the following lines, then save and exit:
```text
Flask==3.0.0
gunicorn==21.2.0

```

#### 3. Create a `Dockerfile`

Run `nano Dockerfile` (no extension), paste this build configuration, then save and exit:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000

```

#### 4. Create a `docker-compose.yml` file

Run `nano docker-compose.yml`, paste the configuration block below, then save and exit.

> ⚠️ **Note on Ports:** The ports section is configured as `"127.0.0.1:8000:8000"`. This locks down the container to only accept traffic from the local machine (perfect if you are using Nginx as a reverse proxy). If you want the site immediately public on port 80 without a reverse proxy, change that line to `- "80:8000"`.

```yaml
services:
  flask_site:
    build: .
    container_name: website_prod
    restart: always
    ports:
      - "127.0.0.1:8000:8000"
    volumes:
      - .:/app
    command: gunicorn --bind 0.0.0.0:8000 app:app
    environment:
      - PYTHONUNBUFFERED=1

```

#### 5. Launch the Container

Run the following command in your terminal to build the image and launch the container in the background:

```bash
docker compose up -d --build

```

* To check if it's running successfully, use: `docker ps`
* To stop the container, use: `docker compose down`

---

### 🌐 Connecting a Domain & SSL Certificates

To make your website accessible via a custom domain (like `yourdomain.com`) instead of a raw IP address, and to secure it with an HTTPS SSL certificate, you will need to set up a web server/reverse proxy.

Because configuring production-grade SSL certificates involves many variables depending on your registrar, a generic summary of the steps is below. For a visual step-by-step walk-through, look up **"How to set up Nginx Reverse Proxy with Let's Encrypt Certbot on Ubuntu"** on YouTube.

#### General Process:

1. **DNS Mapping:** Go to your domain registrar (e.g., Porkbun, Namecheap) and create an **A Record** pointing your domain name directly to your VPS public IP address.
2. **Install a Reverse Proxy:** Install Nginx or Caddy on your host VPS to listen on ports `80` and `443`, and configure it to route incoming traffic straight to your Docker container at `127.0.0.1:8000`.
3. **Generate SSL Certificates:** Use **Certbot** (by Let's Encrypt) to automate fetching and renewing free SSL/TLS certificates so your visitors see the secure padlock icon next to your URL.

---

### 🛡️ Managing Your VPS Firewall

If you aren't using a reverse proxy and changed your ports mapping to expose the site directly to the web (e.g., `- "80:8000"`), you must ensure your server firewall allows public web traffic. On Ubuntu/Debian systems using UFW (Uncomplicated Firewall), manage your rules with these commands:

```bash
# Check your current firewall status and active rules
sudo ufw status

# Allow standard HTTP traffic (Port 80)
sudo ufw allow 80/tcp

# Allow standard HTTPS traffic (Port 443) if you use SSL later
sudo ufw allow 443/tcp

# CRITICAL: Always ensure SSH is allowed before enabling the firewall so you don't lock yourself out!
sudo ufw allow 22/tcp

# Reload the firewall to apply changes
sudo ufw reload

```

---

### ⚠️ Common Docker/Gunicorn Troubleshooting

If you run into issues getting this setup to work, here is how to fix the most common problems:

* **Site isn't loading outside the VPS:** This happens if Gunicorn binds to localhost inside the container. The `command:` block in the `docker-compose.yml` explicitly sets `--bind 0.0.0.0:8000` to resolve this. Also ensure your firewall allows the external port you specified.
* **Volume Overwrite Issues:** The `volumes:` section maps your current host directory (`.`) straight into `/app` inside the container. This makes editing static files easy, but if your local host directory is completely missing files or folders (like `/assets`), it will hide them inside the running container too. Always keep your local workspace organized.
* **"Module not found: app" Error:** The Gunicorn command `app:app` assumes your main Python entry file is named `app.py` and your internal Flask instance is assigned to a variable named `app`. If your entry file is named `main.py`, update the `command:` line in your `docker-compose.yml` to reflect `main:app`.

---

### Running Locally (For Testing)

To test the project on your machine before pushing it up to your Docker environment, navigate to the project directory in your terminal and run:

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

<img width="1916" height="916" alt="image" src="https://github.com/user-attachments/assets/04da68b6-080e-492a-bc66-60fbea24d86c" />
