document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("background-video");
    const muteButton = document.getElementById("mute-button");
    const volumeSlider = document.getElementById("volume-slider");

    // Set initial volume
    const initialVolume = 0.2; // Set your desired initial volume (lower than 0.5)
    video.volume = initialVolume;
    volumeSlider.value = initialVolume; // Set the slider to match the initial volume

    // Mute/Unmute functionality
    muteButton.addEventListener("click", function () {
        if (video.muted) {
            video.muted = false;
            muteButton.textContent = "🔊"; // Show unmuted icon
        } else {
            video.muted = true;
            muteButton.textContent = "🔇"; // Show muted icon
        }
    });

    // Volume control
    volumeSlider.addEventListener("input", function () {
        video.volume = this.value;
        if (video.volume === 0) {
            video.muted = true; // Mute if volume is 0
            muteButton.textContent = "🔇"; // Show muted icon
        } else {
            video.muted = false; // Unmute if volume is above 0
            muteButton.textContent = "🔊"; // Show unmuted icon
        }
    });

    // Play the video and audio
    video.play().then(() => {
        video.muted = false; // Ensure video is not muted
    }).catch(function (error) {
        console.log("Error trying to play video:", error);
    });
});
