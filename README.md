# Project Overview

This project is a proof-of-concept built using AI. While it is fully functional, it is intended for demonstration purposes. If you plan to deploy this for production, I recommend forking the repository to address potential bugs and enhance security measures.

---

## Technical Requirements

| Component | Requirement |
| :--- | :--- |
| **Language** | Python 3.x |
| **Framework** | Flask (`pip install Flask`) |
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

### Running on a VPS (Recommended)
If you are hosting on a Linux VPS, I recommend setting up a virtual environment to keep your dependencies isolated:

```bash
# 1. Create the virtual environment
python3 -m venv venv

# 2. Activate the environment
source venv/bin/activate

# 3. Install requirements
pip install Flask

# 4. Run the app
python app.py

```

### Running Locally

To test the project on your machine, navigate to the project directory in your terminal and run:

```bash
python app.py

```

*(If that fails on Windows, try `py app.py`)*

### Shared/Standard Hosting

If you are using standard web hosting or a PaaS (like Render, Railway, or Heroku), setup will vary by provider. Please consult your host's documentation for deploying Python/Flask applications—this part is on you!

---

## Project Preview

```
<img width="1913" height="915" alt="image" src="https://github.com/user-attachments/assets/fa8a601f-8b09-477d-a07e-6cab92a3e053" />

```
