console.log("viewer.js loaded");

const startButton = document.getElementById("startButton");
const cam = document.getElementById("cam");
const canvas = document.getElementById("view");
const context = canvas.getContext("2d");

const img = new Image();
img.src = "room.jpeg";

img.onload = () => {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
};

img.onerror = () => {
    console.error("Failed to load image");
};

let stream = null;

startButton.addEventListener("click", async () => {
    console.log("Start clicked");

    if (stream) {
        for (const track of stream.getTracks()) {
            track.stop();
        }
        stream = null;
        cam.srcObject = null;
        startButton.textContent = "Start";
        return;
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        cam.srcObject = stream;
        await cam.play();
        startButton.textContent = "Stop";
    } catch (err) {
        console.error(err);
        alert("Could not access the webcam. Please check permissions.");
    }
});