import sys
import json
import base64
import cv2
import numpy as np
import tensorflow as tf
import os
import datetime
from pymongo import MongoClient

# Suppress TensorFlow info logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"  # warnings and errors only
THRESHOLD = 0.6

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["warnwave"]
users = db["users"]

# Load model
model = tf.keras.models.load_model("ges_final.keras", compile=False)

# Load class map
with open("class_map.json", "r") as f:
    class_map = json.load(f)
inv_map = {int(v): k for k, v in class_map.items()}

def preprocess(img):
    img = cv2.resize(img, (224, 224))
    img = img.astype("float32") / 255.0
    return np.expand_dims(img, axis=0)

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        image_b64 = data["image"]
        user_email = data.get("email")

        # Decode base64 → numpy
        img_data = base64.b64decode(image_b64.split(",")[1])
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Predict
        processed = preprocess(img)
        preds = model.predict(processed, verbose=0)
        conf = float(np.max(preds))
        label = int(np.argmax(preds))

        gesture = "Unrecognized" if conf < THRESHOLD else inv_map.get(label, "Unknown")

        result = {
            "gesture": gesture,
            "confidence": round(conf, 3),
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        # Store in MongoDB if recognized
        if user_email and gesture != "Unrecognized":
            users.update_one(
                {"email": user_email},
                {"$push": {"predictions": result}},
                upsert=True
            )

        # ✅ Only print JSON to stdout
        print(json.dumps(result))
        sys.stdout.flush()

    except Exception as e:
        # Send errors as JSON
        print(json.dumps({"error": str(e)}))
        sys.stdout.flush()
        sys.exit(1)
