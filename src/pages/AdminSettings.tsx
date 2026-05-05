import { useState, useEffect } from "react";
import type { Profile } from "../types.ts";

export function AdminSettings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/app/profile")
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch();
  }, []);

  const handleChange = (field: keyof Profile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleLinksChange = (key: string, value: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      contact_links: { ...profile.contact_links, [key]: value }
    });
  };

  const handleStackChange = (value: string) => {
    if (!profile) return;
    setProfile({ ...profile, stack: value.split(",").map(i => i.trim()).filter(Boolean) });
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    setUploading(true);
    setMsg("Uploading profile picture...");
    try {
      const res = await fetch("/app/upload", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("admin_token")
        },
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setMsg("");
      return data.url;
    } catch (e: any) {
      setMsg("Error uploading: " + e.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      if (url) handleChange("profile_pic", url);
    }
  };

  const save = async () => {
    if (!profile) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/app/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("admin_token")
        },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMsg("Settings saved successfully!");
        setTimeout(() => setMsg(""), 3000);
      } else {
        setMsg("Error saving settings");
      }
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <p className="animate-pulse py-10">Loading Settings...</p>;

  return (
    <div className="max-w-3xl space-y-8 fade-in flex flex-col pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your public profile and website preferences.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">Profile Details</h3>
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Profile Picture (Upload or URL)</label>
            <div className="flex gap-2 mb-2">
               <input type="file" accept="image/*" onChange={handleProfilePicUpload} className="text-sm cursor-pointer" disabled={uploading}/>
            </div>
            <input placeholder="Or enter image URL here..." className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#115E59] focus:outline-none transition text-gray-900 dark:text-gray-100" value={profile.profile_pic || ""} onChange={e => handleChange("profile_pic", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Headline</label>
            <input className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#115E59] focus:outline-none transition text-gray-900 dark:text-gray-100" value={profile.headline || ""} onChange={e => handleChange("headline", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">About Me Description</label>
            <textarea rows={4} className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#115E59] focus:outline-none transition text-gray-900 dark:text-gray-100" value={profile.about_me || ""} onChange={e => handleChange("about_me", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Experience</label>
            <textarea rows={4} className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#115E59] focus:outline-none transition text-gray-900 dark:text-gray-100" value={profile.experience || ""} onChange={e => handleChange("experience", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Stack (comma-separated)</label>
            <input className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#115E59] focus:outline-none transition text-gray-900 dark:text-gray-100" value={profile.stack?.join(", ") || ""} onChange={e => handleStackChange(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">Contact Links</h3>
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#115E59] focus:outline-none transition text-gray-900 dark:text-gray-100" value={profile.contact_links?.phone || ""} onChange={e => handleLinksChange("phone", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#115E59] focus:outline-none transition text-gray-900 dark:text-gray-100" value={profile.contact_links?.email || ""} onChange={e => handleLinksChange("email", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
            <input className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#115E59] focus:outline-none transition text-gray-900 dark:text-gray-100" value={profile.contact_links?.github || ""} onChange={e => handleLinksChange("github", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">Website Preferences</h3>
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="chat_toggle"
            checked={profile.chat_enabled ?? true} 
            onChange={e => handleChange("chat_enabled", e.target.checked)} 
            className="w-5 h-5 text-[#115E59] rounded border-gray-300 focus:ring-[#115E59] focus:ring-2"
          />
          <label htmlFor="chat_toggle" className="text-base font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">Enable Website AI Chat Assistant</label>
        </div>
      </div>

      <div className="flex gap-4 items-center pt-2">
        <button disabled={saving || uploading} onClick={save} className="px-8 py-3 bg-[#115E59] text-white rounded-md hover:bg-teal-900 transition font-bold shadow-md">
           {saving ? "Saving Changes..." : "Save All Settings"}
        </button>
        {msg && <p className={msg.includes("Error") ? "text-red-500 font-medium" : (msg.includes("Uploading") ? "text-blue-500 font-medium" : "text-teal-600 font-medium")}>{msg}</p>}
      </div>
    </div>
  );
}
