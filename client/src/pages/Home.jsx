// import { useContext, useState, useRef } from "react";
// import { AuthContext } from "../context/AuthContext";
// import Login from "./Login";
// import Register from "./Register";
// import axios from "axios";

// const DEFAULT_AVATAR =
//   "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&rounded=true";

// export default function Home() {
//   const { user, setUser } = useContext(AuthContext);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   const handleOpenLogin = () => {
//     setShowLogin(true);
//     setShowRegister(false);
//   };
//   const handleOpenRegister = () => {
//     setShowRegister(true);
//     setShowLogin(false);
//   };
//   const handleCloseModals = () => {
//     setShowLogin(false);
//     setShowRegister(false);
//   };

//   // Profile image upload logic
//   const handleProfileImageClick = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   const handleProfileImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", "warnwave"); 
//       const cloudName = "ds2311"; 
//       const uploadRes = await axios.post(
//         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         formData
//       );
//       const imageUrl = uploadRes.data.secure_url;
//       // Update backend
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/profile-image",
//         { profileImage: imageUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUser(res.data);
//     } catch (err) {
//       alert("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
//       {/* Animated Gradient Background */}
//       <div className="absolute inset-0 z-0 animate-bg-gradient bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-90"></div>
//       {/* Watermark Logo */}
//       <div className="pointer-events-none select-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-10 text-[18vw] font-extrabold text-white whitespace-nowrap tracking-widest" style={{fontFamily: 'monospace'}}>W</div>
//       {/* Top-right Navigation */}
//       <div className="absolute top-0 right-0 p-6 z-20 flex gap-4 items-center">
//         {user ? (
//           <>
//             <div className="relative group">
//               <img
//                 src={user.profileImage || DEFAULT_AVATAR}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full border-2 border-white shadow object-cover bg-white cursor-pointer"
//                 onError={e => (e.currentTarget.src = DEFAULT_AVATAR)}
//                 onClick={handleProfileImageClick}
//               />
//               {/* Camera icon overlay */}
//               <button
//                 type="button"
//                 onClick={handleProfileImageClick}
//                 className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                 title="Change profile image"
//                 disabled={uploading}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-4.553a1.5 1.5 0 00-2.121-2.121L13 7.879M7 17h.01M17 7h.01M7 7h.01M17 17h.01M12 12v.01M12 12a5 5 0 11-10 0 5 5 0 0110 0z" /></svg>
//               </button>
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 className="hidden"
//                 onChange={handleProfileImageChange}
//                 disabled={uploading}
//               />
//               {uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full"><div className="loader"></div></div>}
//             </div>
//             <span className="text-white font-semibold text-lg drop-shadow">{user.username}</span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition-all duration-200"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <button
//               onClick={handleOpenLogin}
//               className="bg-white/80 hover:bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow transition-all duration-200"
//             >
//               Login
//             </button>
//             <button
//               onClick={handleOpenRegister}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-all duration-200"
//             >
//               Register
//             </button>
//           </>
//         )}
//       </div>
//       {/* Main Card */}
//       <div className="relative z-20 bg-white/90 rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center animate-fade-in backdrop-blur-md">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 tracking-tight text-center drop-shadow">Warnwave</h1>
//         <p className="text-lg text-gray-700 mb-6 text-center">Welcome to <span className="font-bold text-blue-600">Warnwave</span> — your modern solution for safe gesture-based authentication and alerts. Learn how to use gestures securely and protect your digital identity.</p>
//         <ul className="text-gray-600 text-base mb-6 space-y-2 list-disc list-inside">
//           <li>Sign safely with intuitive gestures</li>
//           <li>Easy, fast, and reliable authentication</li>
//         </ul>
//         <div className="w-full flex flex-col items-center">
//           {user ? (
//             <p className="text-green-600 font-semibold">You are logged in. Enjoy the features!</p>
//           ) : (
//             <p className="text-gray-500">Login or register to get started.</p>
//           )}
//         </div>
//       </div>
//       {/* Modals */}
//       {showLogin && (
//         <Login
//           modal={true}
//           onClose={handleCloseModals}
//           onSwitchToRegister={handleOpenRegister}
//         />
//       )}
//       {showRegister && (
//         <Register
//           modal={true}
//           onClose={handleCloseModals}
//           onSwitchToLogin={handleOpenLogin}
//         />
//       )}
//       {/* Custom Animations */}
//       <style>{`
//         @keyframes bg-gradient {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-bg-gradient {
//           background-size: 200% 200%;
//           animation: bg-gradient 8s ease-in-out infinite;
//         }
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fade-in 1.2s cubic-bezier(0.4,0,0.2,1);
//         }
//         .loader {
//           border: 3px solid #f3f3f3;
//           border-top: 3px solid #3498db;
//           border-radius: 50%;
//           width: 24px;
//           height: 24px;
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
//}


// import { useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import Login from "./Login";
// import Register from "./Register";
// import image from "../assets/image.jpg"; // Adjust path if needed

// export default function Home() {
//   const { user } = useContext(AuthContext);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);

//   const handleOpenLogin = () => {
//     setShowLogin(true);
//     setShowRegister(false);
//   };

//   const handleOpenRegister = () => {
//     setShowRegister(true);
//     setShowLogin(false);
//   };

//   const handleCloseModals = () => {
//     setShowLogin(false);
//     setShowRegister(false);
//   };

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden">
//       {/* Background gradient */}
//       <div className="absolute inset-0 z-0 animate-bg-gradient bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-90" />

//       {/* Watermark */}
//       <div className="pointer-events-none select-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-10 text-[18vw] font-extrabold text-white whitespace-nowrap tracking-widest" style={{ fontFamily: 'monospace' }}>
//         W
//       </div>

//       {/* Main Grid */}
//       <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 min-h-screen items-center px-6 md:px-20">
//         {/* Left Section */}
//         <div className="animate-fade-in text-white space-y-6 text-center md:text-left">
//           <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow">Warnwave</h1>
//           <p className="text-lg md:text-xl max-w-md drop-shadow">
//             Your modern solution for safe gesture-based authentication and alerts.
//           </p>
//           <ul className="text-white/90 text-base md:text-lg space-y-1">
//             <li>✓ Sign safely with intuitive gestures</li>
//             <li>✓ Easy, fast, and reliable authentication</li>
//           </ul>
//           <button
//             onClick={handleOpenLogin}
//             className="mt-4 bg-white text-blue-700 font-bold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition-all"
//           >
//             Get Started
//           </button>
//         </div>

//         {/* Right Side Image with animation */}
//         <div className="animate-float mt-10 md:mt-0 flex justify-center items-center">
//           <img
//             src={image}
//             alt="Project visual"
//             className="w-4/5 max-w-md rounded-2xl shadow-2xl object-contain"
//           />
//         </div>
//       </div>

//       {/* Modals */}
//       {showLogin && (
//         <Login
//           modal={true}
//           onClose={handleCloseModals}
//           onSwitchToRegister={handleOpenRegister}
//         />
//       )}
//       {showRegister && (
//         <Register
//           modal={true}
//           onClose={handleCloseModals}
//           onSwitchToLogin={handleOpenLogin}
//         />
//       )}

//       {/* Custom animations */}
//       <style>{`
//         @keyframes bg-gradient {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-bg-gradient {
//           background-size: 200% 200%;
//           animation: bg-gradient 8s ease-in-out infinite;
//         }
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fade-in 1.2s ease-out;
//         }
//         @keyframes float {
//           0% { transform: translateY(0px); }
//           50% { transform: translateY(-12px); }
//           100% { transform: translateY(0px); }
//         }
//         .animate-float {
//           animation: float 5s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

// import { useContext, useState, useRef } from "react";
// import { AuthContext } from "../context/AuthContext";
// import Login from "./Login";
// import Register from "./Register";
// import axios from "axios";

// const DEFAULT_AVATAR =
//   "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&rounded=true";

// export default function Home() {
//   const { user, setUser } = useContext(AuthContext);
//   const [showAuth, setShowAuth] = useState(false); // for Get Started → open auth modals
//   const [authMode, setAuthMode] = useState("login"); // "login" or "register"
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   // Profile image upload logic
//   const handleProfileImageClick = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   const handleProfileImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", "warnwave");
//       const cloudName = "ds2311"; // <-- replace with your cloud name
//       const uploadRes = await axios.post(
//         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         formData
//       );
//       const imageUrl = uploadRes.data.secure_url;

//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/profile-image",
//         { profileImage: imageUrl },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUser(res.data);
//     } catch (err) {
//       alert("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
//       {/* Gradient Background */}
//       <div className="absolute inset-0 z-0 animate-bg-gradient bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-95"></div>

//       {/* Header (after login only) */}
//       {user && (
//         <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center">
//           <h1 className="text-3xl font-extrabold text-white drop-shadow">
//             warnwave
//           </h1>
//           <div className="flex gap-4 items-center">
//             <div className="relative group">
//               <img
//                 src={user.profileImage || DEFAULT_AVATAR}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full border-2 border-white shadow object-cover cursor-pointer bg-white"
//                 onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
//                 onClick={handleProfileImageClick}
//               />
//               <button
//                 type="button"
//                 onClick={handleProfileImageClick}
//                 className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                 disabled={uploading}
//               >
//                 📷
//               </button>
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 className="hidden"
//                 onChange={handleProfileImageChange}
//                 disabled={uploading}
//               />
//               {uploading && (
//                 <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
//                   <div className="loader"></div>
//                 </div>
//               )}
//             </div>
//             <span className="text-white font-semibold text-lg drop-shadow">
//               {user.username}
//             </span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition-all duration-200"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       {!user ? (
//         <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-8">
//           {/* Left Side - Info */}
//           <div className="text-white max-w-md mb-10 md:mb-0">
//             <h1 className="text-5xl font-extrabold drop-shadow mb-4">
//               warnwave
//             </h1>
//             <p className="text-lg opacity-90 mb-6">
//               A modern solution for <span className="font-bold">gesture-based authentication</span> 
//               and secure alerts. Protect your identity with intuitive, reliable, and fast sign-in.
//             </p>
//             <button
//               onClick={() => {
//                 setAuthMode("login");
//                 setShowAuth(true);
//               }}
//               className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition-all"
//             >
//               Get Started
//             </button>
//           </div>

//           {/* Cloud Rings / Center Illustration */}
//           <div className="hidden md:block w-72 h-72 rounded-full bg-white/20 backdrop-blur-md shadow-2xl animate-pulse"></div>
//         </div>
//       ) : (
//         <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-8">
//           <div className="w-72 h-72 rounded-full bg-white/20 backdrop-blur-md shadow-2xl animate-pulse mb-6"></div>
//           <p className="text-xl">Welcome back, <span className="font-bold">{user.username}</span> 👋</p>
//         </div>
//       )}

//       {/* Auth Modals */}
//       {showAuth && authMode === "login" && (
//         <Login
//           modal={true}
//           onClose={() => setShowAuth(false)}
//           onSwitchToRegister={() => setAuthMode("register")}
//         />
//       )}
//       {showAuth && authMode === "register" && (
//         <Register
//           modal={true}
//           onClose={() => setShowAuth(false)}
//           onSwitchToLogin={() => setAuthMode("login")}
//         />
//       )}

//       {/* Animations */}
//       <style>{`
//         @keyframes bg-gradient {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-bg-gradient {
//           background-size: 200% 200%;
//           animation: bg-gradient 8s ease-in-out infinite;
//         }
//         .loader {
//           border: 3px solid #f3f3f3;
//           border-top: 3px solid #3498db;
//           border-radius: 50%;
//           width: 20px;
//           height: 20px;
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin { 
//           0% { transform: rotate(0deg); } 
//           100% { transform: rotate(360deg); } 
//         }
//       `}</style>
//     </div>
//   );
// }


import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "./Login";
import Register from "./Register";
import axios from "axios";
import signGif from "../assets/sign.gif";

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
        {activePage === "live" && (
          <div className="text-center p-10">⚡ Live Mode Coming Soon...</div>
        )}
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


