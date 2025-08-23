import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function GestureDetection() {
  const webcamRef = useRef(null);
  const [gesture, setGesture] = useState("");

  const captureFrame = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      try {
        const res = await axios.post("http://localhost:5000/api/gesture", {
          image: imageSrc, // sending base64 image
        });

        setGesture(res.data.gesture);
      } catch (err) {
        console.error("Error detecting gesture:", err);
      }
    }
  }, [webcamRef]);

  // Capture frame every 1 sec
  React.useEffect(() => {
    const interval = setInterval(() => {
      captureFrame();
    }, 1000);
    return () => clearInterval(interval);
  }, [captureFrame]);

  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        height={480}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        videoConstraints={videoConstraints}
      />
      <h2 className="mt-4 text-xl font-bold">Detected Gesture: {gesture}</h2>
    </div>
  );
}
