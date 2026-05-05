import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Profile } from "../types.ts";
import { Edit2, Copy, Phone } from "lucide-react";

export function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/app/profile")
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard: " + text);
  };

  if (!profile) return <p className="animate-pulse py-10">Loading Profile...</p>;

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Admin Profile View</h2>
      
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start mt-8">
        {/* Avatar side */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 bg-gray-100">
            <img 
              src={profile.profile_pic || "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=400&auto=format&fit=crop"} 
              alt="Profile View" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">Profile Pic</span>
        </div>
        
        {/* Info side */}
        <div className="flex-1 space-y-6 pt-2">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {profile.headline || "Modern Web Developer & Designer"}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
              {profile.about_me || "About me description Headline"}
            </p>
          </div>
          
          <Link 
            to="/admin/settings"
            className="mt-6 inline-flex items-center gap-2 bg-[#115E59] hover:bg-teal-900 text-white px-5 py-2.5 rounded-md font-medium transition shadow-sm"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile Details
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3 bg-[#e0f2f1] dark:bg-teal-900/30 px-3 py-2 rounded border border-teal-100 dark:border-teal-800 text-sm w-fit">
            <Copy className="w-4 h-4 text-[#115E59] dark:text-teal-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Copy to clipboard for:</span>
            <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white ml-2">
              <Phone className="w-4 h-4 text-[#115E59] dark:text-teal-400" /> 
              {profile.contact_links?.phone || "+91567800"}
            </div>
            <button 
              onClick={() => copyToClipboard(profile.contact_links?.phone || "+91567800")} 
              className="ml-3 bg-[#115E59] text-white px-3 py-1 rounded text-xs font-semibold shadow hover:bg-teal-900 transition"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
