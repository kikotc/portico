import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver } = vision;

console.log("viewer.js loaded");

const startButton = document.getElementById("startButton");
const cam = document.getElementById("cam");
const canvas = document.getElementById("view");
const context = canvas.getContext("2d");

const img = new Image();
img.src = "room.jpeg";

let faceLandmarker = null;

async function initFaceLandmarker() {
  const fileset = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numFaces: 1,
  });

  console.log("FaceLandmarker ready");
}

initFaceLandmarker();

function render(u = 0.5, v = 0.5, zoom = 1.0) {
    if (!img.complete || img.naturalWidth === 0) return;

    u = Math.max(0, Math.min(1, u));
    v = Math.max(0, Math.min(1, v));
    zoom = Math.max(0.5, Math.min(4.0, zoom));

    let sx, sy, sw, sh;
    const imgRatio = img.width / img.height;
    const canRatio = canvas.width / canvas.height;

    if (imgRatio > canRatio) {
        // Image is wider than canvas
        sw = img.height * canRatio;
        sh = img.height;
    } else {
        // Image is taller than canvas
        sw = img.width;
        sh = img.width / canRatio;
    }

    sw = sw / zoom;
    sh = sh / zoom;

    sw = Math.min(sw, img.width);
    sh = Math.min(sh, img.height);

    sx = u * (img.width - sw);
    sy = v * (img.height - sh);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
}

img.onload = () => {
    render(0.5, 0.5, 1.0);
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