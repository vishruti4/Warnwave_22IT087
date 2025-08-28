import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, Camera } from "lucide-react";

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            🤖 Hand Gesture Detection
          </CardTitle>
          <p className="text-gray-500 mt-2">
            Capture a frame and let AI predict your gesture
          </p>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          {/* Webcam with nice rounded styling */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl overflow-hidden shadow-lg border border-gray-200"
          >
            <Webcam
              audio={false}
              height={480}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={640}
              videoConstraints={videoConstraints}
            />
          </motion.div>

          {/* Capture button */}
          <Button
            onClick={captureAndSend}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 text-lg rounded-xl shadow-md hover:shadow-lg transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Predicting...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Capture & Predict
              </>
            )}
          </Button>

          {/* Prediction result */}
          {gesture && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-4"
            >
              <h3 className="text-2xl font-semibold text-purple-700">
                👉 Detected Gesture:
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {gesture}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default GestureDetection;
