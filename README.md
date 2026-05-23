# Project Overview

This project is a proof-of-concept built using AI. While it is fully functional, it is intended for demonstration purposes. If you plan to deploy this for production, I recommend forking the repository to address potential bugs and enhance security measures.

---

## Technical Requirements

| Component | Requirement |
| :--- | :--- |
| **Language** | Python 3.x |
| **Framework** | Flask (`pip install Flask`) |
| **Media Assets** | `profile.jpg`, `background.mp4`, `background_music.mp3` |

---

## Setup Guide

1. **Prepare Assets:** Place the following files into your `/assets` folder:
    * **Profile Picture:** Name it `profile.jpg`.
    * **Background Video:** Name it `background.mp4`.
    * **Background Music:** Name it `background_music.mp3`.

2. **Customize Content:** Open the HTML files to update your personal details, including your social media links, name, bio, and website title.

---

## Deployment & Execution

### Running Locally
To test the project on your machine, navigate to the project directory in your terminal and run:

```bash
python app.py
(If that fails on Windows, try py app.py)

Hosting
If you plan to use this for a live site, you will need to host it on a platform that supports Python/Flask
