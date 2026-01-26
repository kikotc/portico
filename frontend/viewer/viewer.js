console.log("viewer.js loaded");

const startButton = document.getElementById("startButton");
const cam = document.getElementById("cam");
const canvas = document.getElementById("view");
const context = canvas.getContext("2d");

const img = new Image();
img.src = "room.jpeg";

img.onload = () => {
    let sx, sy, sw, sh;
    const imgRatio = img.width / img.height;
    const canRatio = canvas.width / canvas.height;
    if (imgRatio > canRatio) {
        // Image is wider than canvas
        sw = img.height * canRatio;
        sh = img.height;
        sx = (img.width - sw) / 2;
        sy = 0;
    } else {
        // Image is taller than canvas
        sw = img.width;
        sh = img.width / canRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
    }
    context.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
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