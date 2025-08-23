
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "./Login";
import Register from "./Register";
import axios from "axios";
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

  const handleProfileImageClick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "warnwave");
      const cloudName = "ds2311";
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      const imageUrl = uploadRes.data.secure_url;

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

const ProfileSection = ({ user, uploading, fileInputRef, handleProfileImageChange }) => (
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
        />

        {/* Camera icon (always visible) */}
          <button
                 type="button"
              onClick={handleProfileImageClick}
             className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 shadow-lg transition-opacity duration-200"
               title="Change profile image"
                 disabled={uploading}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-4.553a1.5 1.5 0 00-2.121-2.121L13 7.879M7 17h.01M17 7h.01M7 7h.01M17 17h.01M12 12v.01M12 12a5 5 0 11-10 0 5 5 0 0110 0z" /></svg>
              </button>

        {/* Hidden input that actually opens the dialog */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleProfileImageClick}
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
    <div className="bg-gray-50 rounded-lg shadow p-8">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Welcome to warnwave
      </h2>
      <div className="space-y-6 text-gray-700">
        <div>
          <h3 className="font-bold text-xl">⚡ How it Works</h3>
          <p>
            Gesture-based authentication keeps your account secure with modern
            motion patterns.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-xl">📡 Live Mode</h3>
          <p>
            Use live gestures for instant secure access, no passwords required.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-xl">🎯 Training Mode</h3>
          <p>
            Practice and set your custom gestures before enabling them for
            login.
          </p>
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
              warnwave
            </h1>
            <p className="text-lg opacity-90 mb-6">
              A modern solution for{" "}
              <span className="font-bold">gesture-based authentication</span>
              and secure alerts.
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
         <div className="hidden md:block">
  <img
    src={signGif}
    alt="Gesture Animation"
    className="w-72 h-72 object-contain rounded-xl shadow-2xl"
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
        <h1 className="text-2xl font-bold">warnwave</h1>
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
      <footer className="bg-gray-900 text-white flex flex-col md:flex-row justify-between items-center px-8 py-6 text-lg">
        <p>© {new Date().getFullYear()} warnwave. All rights reserved.</p>
        <div className="space-x-6 mt-2 md:mt-0">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
          <a
            href="mailto:contact@warnwave.com"
            className="hover:underline"
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}


