

import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "./Login";
import Register from "./Register";
import axios from "axios";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import signGif from "../assets/sign.gif";
import GestureDetection from "./GestureDetection"
 
const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&rounded=true";

export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [activePage, setActivePage] = useState("home");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

   const handleProfileImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // 🔹 Handle file upload
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "warnwave"); 
      const cloudName = "ds2311"; 

      // Upload to Cloudinary
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      const imageUrl = uploadRes.data.secure_url;

      // Update backend
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/auth/profile-image",
        { profileImage: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };


 const ProfileSection = ({ user, uploading, fileInputRef }) => (
    <div className="bg-white rounded-lg shadow p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Profile</h2>
      <div className="flex flex-col items-center space-y-3">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={user?.profileImage || DEFAULT_AVATAR}
            alt="Profile"
            className="w-28 h-28 rounded-full border shadow object-cover bg-white"
            onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
            onClick={handleProfileImageClick}
          />

          {/* Camera icon (opens file dialog) */}
          <button
            type="button"
            onClick={handleProfileImageClick}
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 shadow-lg transition-opacity duration-200"
            title="Change profile image"
            disabled={uploading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-4.553a1.5 1.5 0 00-2.121-2.121L13 7.879M7 17h.01M17 7h.01M7 7h.01M17 17h.01M12 12v.01M12 12a5 5 0 11-10 0 5 5 0 0110 0z"
              />
            </svg>
          </button>

          {/* Hidden input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleProfileImageChange}
            disabled={uploading}
          />

          {/* Uploading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
              <div className="loader"></div>
            </div>
          )}
        </div>

        {/* Username + Email */}
        <p className="font-semibold">{user?.username}</p>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </div>
    </div>
  );



 const InfoSection = () => (
  <div className="bg-gray-50 rounded-lg shadow p-8 space-y-10">
    {/* Title */}
    <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
      Welcome To Warnwave
    </h2>

    {/* Problem Statement */}
    <div className="text-gray-700 space-y-3">
      <h3 className="font-bold text-xl"> What is Warnwave?</h3>
      <p>
        <span className="font-semibold">Warnwave</span> is a gesture-based
        communication and authentication system designed for{" "}
        <span className="text-blue-600 font-semibold">conflict zones and
        emergencies</span>. In noisy or chaotic situations where words fail,
        universally recognized <span className=" ">hand gestures</span>{" "}
        provide quick, safe, and reliable communication for{" "}
        <span className="italic">safety, evacuation, and compliance</span>.
      </p>
    </div>

    {/* How It Works */}
    <div className="space-y-6 text-gray-700">
      <h3 className="font-bold text-2xl text-center">⚡ How it Works</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
          <h4 className="font-bold text-xl mb-2">📡 Live Mode</h4>
          <p>
            Instantly predicts and recognizes gestures in{" "}
            <span className="font-semibold">real-time</span>. No need for
            passwords—gestures are enough for secure access and signaling and also be notify by notfication that this sign is predict.
          </p>
        </div>
        <div className="p-6 bg-green-50 rounded-lg shadow-inner">
          <h4 className="font-bold text-xl mb-2">🎯 Training Mode</h4>
          <p>
            Practice your gestures and{" "}
            <span className="font-semibold">train the system</span>. Once
            trained, you can confidently use them in Live Mode.
          </p>
        </div>
      </div>
    </div>

    {/* Gesture Table */}
    <div className="text-gray-700">
      <h3 className="font-bold text-2xl text-center mb-4">
        ✋ Universal Gesture Signals
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-lg">
              <th className="p-3 text-left">Gesture</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Signal Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white hover:bg-blue-50">
              <td className="p-3">✋ Open Palm</td>
              <td className="p-3">Raise one open hand upright</td>
              <td className="p-3 font-semibold text-red-600">Stop / Halt</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-blue-50">
              <td className="p-3">✌️ V-shape</td>
              <td className="p-3">Two fingers up (Victory sign)</td>
              <td className="p-3 font-semibold text-green-600">
                All Clear / Peaceful
              </td>
            </tr>
            <tr className="bg-white hover:bg-blue-50">
              <td className="p-3">👊 Fist</td>
              <td className="p-3">Closed fist held up</td>
              <td className="p-3 font-semibold text-red-700">Danger / Attack</td>
            </tr>
            <tr className="bg-gray-50 hover:bg-blue-50">
              <td className="p-3">☝️ One Finger Up</td>
              <td className="p-3">Index finger up</td>
              <td className="p-3 font-semibold text-blue-600">
                Attention / Look Here
              </td>
            </tr>
            <tr className="bg-white hover:bg-blue-50">
              <td className="p-3">✊ Fist Up</td>
              <td className="p-3">Bent elbow, raised fist</td>
              <td className="p-3 font-semibold text-orange-600">
                Protest / Civil Movement
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-blue-50">
              <td className="p-3">🤙 Call Me</td>
              <td className="p-3">Thumb and pinky extended</td>
              <td className="p-3 font-semibold text-indigo-600">
                Need Communication
              </td>
            </tr>
            <tr className="bg-white hover:bg-blue-50">
              <td className="p-3">🖐️✌️ Wave + V</td>
              <td className="p-3">Wave then Victory sign</td>
              <td className="p-3 font-semibold text-green-700">
                Evacuation Complete
              </td>
            </tr>
            <tr className="bg-gray-50 hover:bg-blue-50">
              <td className="p-3">✖️ Crossed Arms</td>
              <td className="p-3">Arms crossed in X</td>
              <td className="p-3 font-semibold text-red-800">
                Do Not Enter / Hazard Zone
              </td>
            </tr>
            <tr className="bg-white hover:bg-blue-50">
              <td className="p-3">🤫 Hand Over Mouth</td>
              <td className="p-3">Palm covering mouth</td>
              <td className="p-3 font-semibold text-gray-700">
                Maintain Silence
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

  if (!user) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 animate-bg-gradient bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-95"></div>
        <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-8">
          <div className="text-white max-w-md mb-10 md:mb-0">
            <h1 className="text-5xl font-extrabold drop-shadow mb-4">
              Warnwave
            </h1>
            <p className="text-lg opacity-90 mb-6">
              A modern solution for{" "}
              <span className="font-bold">Gesture-Based Public Protection System </span>
             ensuring quick, universal, and reliable communication in emergencies and conflict zones.
            </p>
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuth(true);
              }}
              className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition-all"
            >
              Get Started
            </button>
          </div>
     <div className="hidden md:flex w-1/2 h-screen justify-end items-right ">
  <img
    src={signGif}
    alt="Gesture Animation"
    className="w-full h-full object-cover"
  />
</div>
        </div>

        {showAuth && authMode === "login" && (
          <Login
            modal={true}
            onClose={() => setShowAuth(false)}
            onSwitchToRegister={() => setAuthMode("register")}
          />
        )}
        {showAuth && authMode === "register" && (
          <Register
            modal={true}
            onClose={() => setShowAuth(false)}
            onSwitchToLogin={() => setAuthMode("login")}
          />
        )}

        <style>{`
          @keyframes bg-gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-bg-gradient {
            background-size: 200% 200%;
            animation: bg-gradient 8s ease-in-out infinite;
          }
          .loader {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Dashboard layout
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center text-lg">
        <h1 className="text-2xl font-bold">Warnwave</h1>
        <div className="flex space-x-6">
          <button
            onClick={() => setActivePage("home")}
            className="hover:text-blue-400"
          >
            Home
          </button>
          <button
            onClick={() => setActivePage("live")}
            className="hover:text-blue-400"
          >
            Live Mode
          </button>
          <button
            onClick={() => setActivePage("training")}
            className="hover:text-blue-400"
          >
            Training Mode
          </button>
          <button
            onClick={() => setActivePage("profile")}
            className="hover:text-blue-400"
          >
            Profile
          </button>
          <button onClick={handleLogout} className="hover:text-red-500">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        {activePage === "home" && <InfoSection />}
        {activePage === "live" && <GestureDetection />}
        {activePage === "training" && (
          <div className="text-center p-10">
            🎯 Training Mode Coming Soon...
          </div>
        )}
        {activePage === "profile" && (
  <ProfileSection
    user={user}
    uploading={uploading}
    fileInputRef={fileInputRef}
    handleProfileImageClick={handleProfileImageClick}
  />
)}
      </main>

     {/* Footer */}
<footer className="bg-gray-900 text-gray-300">
  <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
    
    {/* Left - Copyright */}
    <div className="flex flex-col items-center md:items-start">
      <h2 className="text-xl font-bold text-white"> Warnwave</h2>
      <p className="mt-2 text-sm">
        © {new Date().getFullYear()} Warnwave. All rights reserved.
      </p>
    </div>

    {/* Middle - Contact Info */}
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-white">📞 Contact Us</h3>
      <p className="text-sm">Phone: +91 98765 43210</p>
      <p className="text-sm">Email: contact@warnwave.com</p>
    </div>

    {/* Right - Social Links */}
        <div className="flex flex-col items-center md:items-end space-y-2">
          <h3 className="text-lg font-semibold text-white">Connect</h3>
          <div className="flex space-x-6 text-2xl">
            <a
              href="https://github.com/DISHA23S/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        Built with ❤️ for safe communication
      </div>
    </footer>

    </div>
  );
}


