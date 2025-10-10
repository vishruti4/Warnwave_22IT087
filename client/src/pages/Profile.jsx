import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {Link} from "react-router-dom";

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "warnwave";

export default function Profile() {
  const { user, setUser, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [profileImage, setProfileImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || "", email: user.email || "", password: "" });
      setProfileImage(user.profileImage || "");
    }
  }, [user]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(url, { method: "POST", body: data });
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return json.secure_url;
  };

  const onSelectImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsSaving(true);
      const url = await uploadToCloudinary(file);
      setProfileImage(url);
      setMessage("Image uploaded");
    } catch {
      setMessage("Image upload failed");
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = { ...form, profileImage };
      if (!payload.password) delete payload.password;
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/update-profile",
        payload,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setUser(data);
      // re-fetch from server to ensure latest state propagates everywhere
      await refreshUser();
      setForm((prev) => ({ ...prev, password: "" }));
      setMessage("Profile updated");
      setTimeout(() => {
      navigate("/");  
    }, 1000);
    } catch (err) {
      setMessage(err?.response?.data?.msg || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur shadow-2xl overflow-hidden">
        <div className="p-8 md:p-10 grid md:grid-cols-[240px,1fr] gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative">
              <img
                src={profileImage || "/default-avatar.png"}
                alt="Profile"
                className="h-40 w-40 rounded-2xl object-cover border border-slate-800 shadow"
              />
              <label className="absolute -bottom-3 -right-3 cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-sm font-medium shadow-lg">
                <input type="file" accept="image/*" className="hidden" onChange={onSelectImage} />
                <span>Change</span>
              </label>
            </div>
            {profileImage && (
              <button
                type="button"
                onClick={() => setProfileImage("")}
                className="mt-4 text-xs text-slate-300 hover:text-slate-100 underline"
              >
                Use default avatar
              </button>
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Your username"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 px-5 py-3 font-medium shadow-lg"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center rounded-xl bg-slate-700 hover:bg-slate-600 px-5 py-3 font-medium shadow"
              >
                Back
              </button>
              {message && <span className="text-sm text-slate-300">{message}</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

