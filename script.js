// Main initialization function
function initPage() {
  console.log("Initializing duziy profile page...");

  // ==================== DOM ELEMENTS ====================

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

  // FORCE STOP VIDEO ON LOAD
  if (elements.video) {
    elements.video.pause();
    elements.video.currentTime = 0;
  }

  // ==================== BIO TYPEWRITER ====================

  const bioMessages = ["Just some guy on the internet!", "Just live a little!"];

  let bioState = {
    text: "",
    index: 0,
    messageIndex: 0,
    isDeleting: false,
    cursorVisible: true,
  };

  // ==================== VOLUME STATE ====================

  let currentVolume = 0.3;

  // ==================== VOLUME STORAGE ====================

  function initializeVolume() {
    try {
      let volume = 0.3;

      const hostKey = window.location.hostname.replace(/\./g, "_");
      const storageKey = `duziy_volume_${hostKey}`;

      const saved = localStorage.getItem(storageKey);

      if (saved !== null) {
        const parsed = parseFloat(saved);

        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          volume = parsed;
        }
      }

      if (elements.video) {
        elements.video.volume = volume;
      }

      if (elements.volumeSlider) {
        elements.volumeSlider.value = volume;
      }

      currentVolume = volume;

      return volume;
    } catch (error) {
      return 0.3;
    }
  }

  function saveVolume(volume) {
    try {
      const hostKey = window.location.hostname.replace(/\./g, "_");
      const storageKey = `duziy_volume_${hostKey}`;

      localStorage.setItem(storageKey, volume.toString());
      localStorage.setItem("duziy_volume_universal", volume.toString());

      currentVolume = volume;
    } catch (error) {
      currentVolume = volume;
    }
  }

  // Initialize saved volume
  initializeVolume();

  // ==================== START SCREEN ====================

  function setupStartScreen() {
    if (!elements.startScreen) return;

    if (elements.startText) {
      elements.startText.textContent = "Epilepsy warning, click to continue!";
    }

    elements.startScreen.addEventListener("click", handleStartClick);
  }

  function handleStartClick() {
    if (elements.startScreen) {
      elements.startScreen.style.display = "none";
    }

    startExperience();
  }

  function startExperience() {
    // Start video/audio ONLY after click
    if (elements.video) {
      elements.video.muted = false;
      elements.video.volume = currentVolume;

      updateMuteIcon();

      const playPromise = elements.video.play();

      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Video play prevented:", err);
        });
      }
    }

    // Show profile block
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

    // Slider
    elements.volumeSlider.addEventListener("input", function () {
      const newVolume = parseFloat(this.value);

      elements.video.volume = newVolume;

      elements.video.muted = newVolume === 0;

      if (newVolume > 0) {
        currentVolume = newVolume;
        saveVolume(newVolume);
      }

      updateMuteIcon();
    });

    // Toggle mute
    function toggleMute() {
      elements.video.muted = !elements.video.muted;

      if (!elements.video.muted) {
        elements.video.volume = currentVolume;

        if (elements.volumeSlider) {
          elements.volumeSlider.value = currentVolume;
        }
      }

      updateMuteIcon();
    }

    // Desktop
    elements.volumeIcon.addEventListener("click", toggleMute);

    updateMuteIcon();
  }

  // ==================== MUTE ICON ====================

  function updateMuteIcon() {
    if (!elements.volumeIcon || !elements.video) return;

    const muted = elements.video.muted || elements.video.volume === 0;

    if (muted) {
      elements.volumeIcon.innerHTML = `
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z">
        </path>

        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2">
        </path>
      `;
    } else {
      elements.volumeIcon.innerHTML = `
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z">
        </path>
      `;
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

  // ==================== PROFILE PICTURE ====================

  function setupProfilePicture() {
    if (!elements.profilePic || !elements.profileContainer) return;

    elements.profilePic.addEventListener("click", spinProfilePicture);
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAll);
  } else {
    initializeAll();
  }
}

// Start the page
initPage();
