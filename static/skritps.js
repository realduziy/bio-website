// scripts.js
class VideoController {
    constructor() {
        this.video = document.getElementById('background-video');
        this.muteButton = document.getElementById('mute-button');
        this.volumeSlider = document.getElementById('volume-slider');
        this.initialVolume = 0.2;
        this.hasUserInteracted = false;
        this.autoplayBlockedMessage = null;

        this.init();
    }

    init() {
        // Load saved volume from localStorage or use initialVolume
        const savedVolume = localStorage.getItem('videoVolume');
        this.initialVolume = savedVolume !== null ? parseFloat(savedVolume) : this.initialVolume;

        // Set initial state
        this.video.volume = this.initialVolume;
        this.volumeSlider.value = this.initialVolume;

        // Start unmuted
        this.video.muted = false;
        this.updateButton();

        this.setupEventListeners();
        this.playVideo();
    }

    setupEventListeners() {
        this.muteButton.addEventListener('click', () => this.handleMuteToggle());
        this.volumeSlider.addEventListener('input', () => this.handleVolumeChange());

        // Capture first user interaction anywhere on page
        document.addEventListener('click', () => this.handleFirstInteraction(), { once: true });
    }

    handleMuteToggle() {
        this.video.muted = !this.video.muted;
        this.updateButton();
    }

    handleVolumeChange() {
        let newVolume = parseFloat(this.volumeSlider.value);
        if (isNaN(newVolume)) newVolume = 0.2;
        newVolume = Math.max(0, Math.min(1, newVolume));
        this.video.volume = newVolume;
        // Save volume setting to localStorage
        localStorage.setItem('videoVolume', newVolume.toString());
        if (newVolume > 0) {
            this.video.muted = false;
            this.updateButton();
        }
    }

    handleFirstInteraction() {
        this.hasUserInteracted = true;
        try {
            this.video.muted = false;
            this.updateButton();
            this.video.play();
            this.removeAutoplayBlockedMessage();
        } catch (error) {
            console.log('Automatic unmute failed:', error);
        }
    }

    updateButton() {
        this.muteButton.textContent = this.video.muted ? '🔇' : '🔊';
        this.volumeSlider.disabled = this.video.muted;
    }

    async playVideo() {
        try {
            await this.video.play();
            this.removeAutoplayBlockedMessage();
        } catch (error) {
            console.error('Video playback failed:', error);
            this.showAutoplayBlockedMessage();
        }
    }

    showAutoplayBlockedMessage() {
        if (this.autoplayBlockedMessage) return;

        const message = document.createElement('div');
        message.textContent = 'Does the website look weird to you? It\'s probably because your browser is blocking videos from auto-playing.';
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
        message.style.color = 'white';
        message.style.padding = '30px';
        message.style.borderRadius = '15px';
        message.style.zIndex = '1000';
        message.style.textAlign = 'center';
        message.style.fontSize = '2rem';
        message.style.fontWeight = 'bold';
        message.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.7)';
        message.style.border = '3px solid white';
        document.body.appendChild(message);

        this.autoplayBlockedMessage = message;
    }

    removeAutoplayBlockedMessage() {
        if (this.autoplayBlockedMessage) {
            this.autoplayBlockedMessage.remove();
            this.autoplayBlockedMessage = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new VideoController());
