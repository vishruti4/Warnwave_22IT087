import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import "@tensorflow/tfjs-backend-webgl";
import axios from "axios";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

function GestureDetection() {
  const webcamRef = useRef(null);
  const [gesture, setGesture] = useState("");
  const [loading, setLoading] = useState(false);

  const captureAndSend = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/gesture", { image: imageSrc });
      setGesture(res.data.gesture);
    } catch (err) {
      console.error("Prediction error:", err);
    }
    setLoading(false);
  }, [webcamRef]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>🤖 Hand Gesture Detection</h2>
      <Webcam
        audio={false}
        height={480}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        videoConstraints={videoConstraints}
      />
      <br />
      <button
        onClick={captureAndSend}
        style={{ padding: "10px 20px", marginTop: "10px", fontSize: "16px", cursor: "pointer" }}
      >
        Capture & Predict
      </button>

      {loading && <p>⏳ Predicting...</p>}
      {gesture && <h3>👉 Detected Gesture: {gesture}</h3>}
    </div>
  );
}

export default GestureDetection;