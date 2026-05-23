// Main initialization function
function initPage() {
  console.log("Initializing duziy profile page...");

  // Get all DOM elements
  const elements = {
    startScreen: document.getElementById("start-screen"),
    startText: document.getElementById("start-text"),
    profileBlock: document.getElementById("profile-block"),
    profileName: document.getElementById("profile-name"),
    profileBio: document.getElementById("profile-bio"),
    video: document.getElementById("background"),
    volumeSlider: document.getElementById("volume-slider"),
    volumeIcon: document.getElementById("volume-icon"),
    cursor: document.querySelector(".custom-cursor"),
    profilePic: document.querySelector(".profile-picture"),
    profileContainer: document.querySelector(".profile-container"),
  };

  // Bio typewriter variables
  const bioMessages = ["Just some guy on the internet!", "Just live a little!"];
  let bioState = {
    text: "",
    index: 0,
    messageIndex: 0,
    isDeleting: false,
    cursorVisible: true,
  };

  // Volume state - SIMPLE AND BULLETPROOF
  let currentVolume = 0.3;
  let isMuted = false;

  // ==================== BULLETPROOF VOLUME SYSTEM ====================

  function initializeVolume() {
    try {
      // 1. First try: Check if there's any data at all in localStorage
      // (This works even if domain has separate storage from IP)
      let volume = 0.3;

      // Generate a storage key based on current hostname
      const hostKey = window.location.hostname.replace(/\./g, "_");
      const storageKey = `duziy_volume_${hostKey}`;

      // Try to get from this specific domain's storage
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          volume = parsed;
        }
      }

      // 2. Apply the volume
      if (elements.video) {
        elements.video.volume = volume;
      }

      if (elements.volumeSlider) {
        elements.volumeSlider.value = volume;
      }

      currentVolume = volume;
      return volume;
    } catch (error) {
      // If everything fails, use default
      return 0.3;
    }
  }

  function saveVolume(volume) {
    try {
      // Save with host-specific key
      const hostKey = window.location.hostname.replace(/\./g, "_");
      const storageKey = `duziy_volume_${hostKey}`;

      localStorage.setItem(storageKey, volume.toString());

      // Also save to a universal key as backup
      localStorage.setItem("duziy_volume_universal", volume.toString());

      currentVolume = volume;
    } catch (error) {
      // If storage fails, at least keep it in memory
      currentVolume = volume;
    }
  }

  // Initialize volume immediately
  initializeVolume();

  // ==================== START SCREEN ====================
  function setupStartScreen() {
    if (!elements.startScreen) return;

    if (elements.startText) {
      elements.startText.textContent = "Epilepsy warning, click to continue!";
    }

    elements.startScreen.addEventListener("click", handleStartClick);

    elements.startScreen.addEventListener("touchstart", function (e) {
      e.preventDefault();
      handleStartClick();
    });

    // Check if already started
    try {
      const videoPlaying = elements.video && !elements.video.paused;
      if (videoPlaying) {
        elements.startScreen.style.display = "none";
        startExperience();
      }
    } catch (e) {}
  }

  function handleStartClick() {
    if (elements.startScreen) {
      elements.startScreen.style.display = "none";
    }
    startExperience();
  }

  function startExperience() {
    // Play video with current volume
    if (elements.video) {
      elements.video.muted = false;
      elements.video.volume = currentVolume;

      const playPromise = elements.video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          elements.video.muted = true;
          elements.video.play();
        });
      }
    }

    // Show profile block with animation
    if (elements.profileBlock) {
      elements.profileBlock.style.opacity = "1";

      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          elements.profileBlock,
          { opacity: 0, y: -50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
              if (elements.profileContainer) {
                elements.profileContainer.classList.add("orbit");
              }
            },
          },
        );
      } else {
        elements.profileBlock.style.transition = "opacity 1s, transform 1s";
        elements.profileBlock.style.transform = "translate(-50%, -50%)";

        if (elements.profileContainer) {
          setTimeout(() => {
            elements.profileContainer.classList.add("orbit");
          }, 500);
        }
      }
    }

    // Start bio typewriter
    startBioTypewriter();
  }

  // ==================== BIO TYPEWRITER ====================
  function startBioTypewriter() {
    if (!elements.profileBio) return;

    if (elements.profileName) {
      elements.profileName.textContent = "duziy";
    }

    function typeBio() {
      const { isDeleting, index, messageIndex } = bioState;
      const message = bioMessages[messageIndex];

      if (!isDeleting && index < message.length) {
        bioState.text = message.slice(0, index + 1);
        bioState.index++;
      } else if (isDeleting && index > 0) {
        bioState.text = message.slice(0, index - 1);
        bioState.index--;
      } else if (index === message.length) {
        bioState.isDeleting = true;
        setTimeout(typeBio, 3000);
        return;
      } else if (index === 0 && isDeleting) {
        bioState.isDeleting = false;
        bioState.messageIndex = (messageIndex + 1) % bioMessages.length;
      }

      elements.profileBio.textContent =
        bioState.text + (bioState.cursorVisible ? "|" : " ");

      const speed = isDeleting ? 75 : 150;
      setTimeout(typeBio, speed);
    }

    // Cursor blink
    setInterval(() => {
      bioState.cursorVisible = !bioState.cursorVisible;
      if (elements.profileBio) {
        elements.profileBio.textContent =
          bioState.text + (bioState.cursorVisible ? "|" : " ");
      }
    }, 500);

    setTimeout(typeBio, 500);
  }

  // ==================== VOLUME CONTROLS ====================
  function setupVolumeControls() {
    if (!elements.volumeSlider || !elements.volumeIcon || !elements.video)
      return;

    // Volume slider
    elements.volumeSlider.addEventListener("input", function () {
      const newVolume = parseFloat(this.value);

      elements.video.volume = newVolume;
      elements.video.muted = false;
      isMuted = false;

      saveVolume(newVolume);
      updateMuteIcon();
    });

    // Mute/unmute button
    elements.volumeIcon.addEventListener("click", function () {
      isMuted = !elements.video.muted;
      elements.video.muted = isMuted;

      if (!isMuted) {
        // Restore saved volume
        elements.video.volume = currentVolume;
        if (elements.volumeSlider) {
          elements.volumeSlider.value = currentVolume;
        }
      }

      updateMuteIcon();
    });

    // Touch support
    elements.volumeIcon.addEventListener("touchstart", function (e) {
      e.preventDefault();
      isMuted = !elements.video.muted;
      elements.video.muted = isMuted;

      if (!isMuted) {
        elements.video.volume = currentVolume;
        if (elements.volumeSlider) {
          elements.volumeSlider.value = currentVolume;
        }
      }

      updateMuteIcon();
    });

    updateMuteIcon();
  }

  function updateMuteIcon() {
    if (!elements.volumeIcon || !elements.video) return;

    if (elements.video.muted) {
      elements.volumeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`;
    } else {
      elements.volumeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
    }
  }

  // ==================== CUSTOM CURSOR ====================
  function setupCustomCursor() {
    if (!elements.cursor) return;

    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      document.body.classList.add("touch-device");
    } else {
      document.addEventListener("mousemove", function (e) {
        elements.cursor.style.left = e.clientX + "px";
        elements.cursor.style.top = e.clientY + "px";
        elements.cursor.style.display = "block";
      });

      document.addEventListener("mousedown", function () {
        elements.cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
      });

      document.addEventListener("mouseup", function () {
        elements.cursor.style.transform = "translate(-50%, -50%) scale(1)";
      });

      document.addEventListener("mouseleave", function () {
        elements.cursor.style.display = "none";
      });

      document.addEventListener("mouseenter", function () {
        elements.cursor.style.display = "block";
      });
    }
  }

  // ==================== PROFILE PICTURE INTERACTION ====================
  function setupProfilePicture() {
    if (!elements.profilePic || !elements.profileContainer) return;

    elements.profilePic.addEventListener("click", function () {
      spinProfilePicture();
    });

    elements.profilePic.addEventListener("touchstart", function (e) {
      e.preventDefault();
      spinProfilePicture();
    });
  }

  function spinProfilePicture() {
    if (!elements.profileContainer) return;

    elements.profileContainer.classList.remove("fast-orbit", "orbit");
    void elements.profileContainer.offsetWidth;
    elements.profileContainer.classList.add("fast-orbit");

    setTimeout(() => {
      elements.profileContainer.classList.remove("fast-orbit");
      void elements.profileContainer.offsetWidth;
      elements.profileContainer.classList.add("orbit");
    }, 500);
  }

  // ==================== INITIALIZE EVERYTHING ====================
  function initializeAll() {
    setupStartScreen();
    setupVolumeControls();
    setupCustomCursor();
    setupProfilePicture();

    if (elements.video && !elements.video.paused) {
      elements.startScreen.style.display = "none";
      if (elements.profileBlock) {
        elements.profileBlock.style.opacity = "1";
        if (elements.profileContainer) {
          elements.profileContainer.classList.add("orbit");
        }
      }
      startBioTypewriter();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAll);
  } else {
    initializeAll();
  }
}

// Start the page
initPage();
