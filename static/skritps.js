document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('background-video');
    const muteButton = document.getElementById('mute-button');
    const volumeSlider = document.getElementById('volume-slider');

    const DEFAULT_VOLUME = 0.2;
    const DEFAULT_MUTED = false;

    let isUserInteracted = false;
    let storageAvailable = true;

    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
    } catch (e) {
        storageAvailable = false;
        console.warn('LocalStorage is not available. Settings will not persist.');
    }

    // Improved video sizing function
    function resizeVideo() {
        const videoRatio = video.videoWidth / video.videoHeight;
        const windowRatio = window.innerWidth / window.innerHeight;

        if (windowRatio > videoRatio) {
            // Window is wider than video - scale to height
            video.style.width = 'auto';
            video.style.height = '100%';
        } else {
            // Window is taller than video - scale to width
            video.style.width = '100%';
            video.style.height = 'auto';
        }
    }

    // Setup video event listeners
    function setupVideo() {
        // If metadata is already loaded
        if (video.readyState >= 1) {
            resizeVideo();
        }

        video.addEventListener('loadedmetadata', function() {
            resizeVideo();
            // Some browsers need this slight delay
            setTimeout(resizeVideo, 50);
        });

        video.addEventListener('resize', resizeVideo);
        window.addEventListener('resize', resizeVideo);
    }

    showEpilepsyWarning();
    setupVideo();

    function showEpilepsyWarning() {
        video.muted = true;
        
        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'epilepsy-modal-backdrop';
        modalBackdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const warning = document.createElement('div');
        warning.className = 'epilepsy-warning';
        warning.style.cssText = `
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            font-size: 2rem;
            font-weight: bold;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
            border: 3px solid white;
            cursor: pointer;
            max-width: 80%;
        `;
        
        warning.innerHTML = `
            Epilepsy Warning: This website contains flashing lights that may trigger seizures.
            <div style="font-size: 1rem; margin-top: 15px;">Click to continue</div>
        `;

        modalBackdrop.appendChild(warning);
        document.body.appendChild(modalBackdrop);

        document.body.classList.add('modal-open');

        const clickHandler = () => {
            modalBackdrop.remove();
            document.body.classList.remove('modal-open');
            isUserInteracted = true;
            initializeVideoControls();
            attemptVideoPlayback();
            // Resize again after interaction
            setTimeout(resizeVideo, 100);
        };

        warning.addEventListener('click', clickHandler);
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                clickHandler();
            }
        });
    }

    function initializeVideoControls() {
        let volume = DEFAULT_VOLUME;
        let muted = DEFAULT_MUTED;

        if (storageAvailable) {
            try {
                const savedVolume = localStorage.getItem('videoVolume');
                const savedMuted = localStorage.getItem('videoMuted');
                
                if (savedVolume !== null) {
                    const parsedVolume = parseFloat(savedVolume);
                    if (isValidVolume(parsedVolume)) {
                        volume = parsedVolume;
                    }
                }
                
                if (savedMuted !== null) {
                    muted = savedMuted === 'true';
                }
            } catch (e) {
                console.warn('Error reading from localStorage:', e);
                storageAvailable = false;
            }
        }

        video.volume = volume;
        video.muted = muted;
        
        updateUIControls();

        muteButton.addEventListener('click', handleMuteToggle);
        volumeSlider.addEventListener('input', handleVolumeChange);
        video.addEventListener('volumechange', handleVideoVolumeChange);
    }

    function updateUIControls() {
        muteButton.textContent = video.muted ? '🔇' : '🔊';
        volumeSlider.value = video.volume;
        volumeSlider.disabled = video.muted;
        volumeSlider.classList.toggle('muted', video.muted);
    }

    function handleMuteToggle() {
        video.muted = !video.muted;
        
        if (storageAvailable) {
            try {
                localStorage.setItem('videoMuted', video.muted);
            } catch (e) {
                console.warn('Error saving to localStorage:', e);
                storageAvailable = false;
            }
        }
        
        if (!video.muted && video.volume === 0) {
            video.volume = DEFAULT_VOLUME;
            if (storageAvailable) {
                try {
                    localStorage.setItem('videoVolume', DEFAULT_VOLUME);
                } catch (e) {
                    console.warn('Error saving to localStorage:', e);
                    storageAvailable = false;
                }
            }
        }
        
        updateUIControls();
    }

    function handleVolumeChange() {
        const newVolume = parseFloat(volumeSlider.value);
        video.volume = newVolume;
        
        if (storageAvailable) {
            try {
                localStorage.setItem('videoVolume', newVolume);
            } catch (e) {
                console.warn('Error saving to localStorage:', e);
                storageAvailable = false;
            }
        }
        
        if (video.muted && newVolume > 0) {
            video.muted = false;
            if (storageAvailable) {
                try {
                    localStorage.setItem('videoMuted', false);
                } catch (e) {
                    console.warn('Error saving to localStorage:', e);
                    storageAvailable = false;
                }
            }
        }
        
        updateUIControls();
    }

    function handleVideoVolumeChange() {
        updateUIControls();
    }

    function attemptVideoPlayback() {
        if (isUserInteracted) {
            video.muted = false;
            video.play().catch(e => {
                console.warn('Autoplay prevented:', e);
                showPlayButton();
            });
        }
    }

    function showPlayButton() {
        const playButton = document.createElement('button');
        playButton.className = 'play-fallback-button';
        playButton.textContent = '▶ Play Video';
        playButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: 2px solid white;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        `;
        playButton.addEventListener('click', () => {
            video.play();
            playButton.remove();
            resizeVideo(); // Resize after play
        });
        document.body.appendChild(playButton);
    }

    function isValidVolume(vol) {
        return !isNaN(vol) && vol >= 0 && vol <= 1;
    }
});
