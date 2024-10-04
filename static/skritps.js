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
        video.muted = !video.muted; // Toggle mute state
        muteButton.textContent = video.muted ? "🔇" : "🔊"; // Update button icon
    });

    // Volume control
    volumeSlider.addEventListener("input", function () {
        video.volume = this.value;
        video.muted = video.volume === 0; // Mute if volume is 0
        muteButton.textContent = video.muted ? "🔇" : "🔊"; // Update button icon
    });

    // Play the video and audio
    video.play().then(() => {
        video.muted = false; // Ensure video is not muted
    }).catch(function (error) {
        console.log("Error trying to play video:", error);
        // Consider prompting the user to interact if autoplay is blocked
        muteButton.textContent = "🔊"; // Show unmuted icon
        alert("Please click the mute button to allow audio.");
    });
});
