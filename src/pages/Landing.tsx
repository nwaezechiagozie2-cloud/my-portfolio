import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { type Profile } from "../types.ts";
import { Github, Linkedin, Mail, Phone, Edit2 } from "lucide-react";
import { Navbar } from "../components/Navbar.tsx";

export function Landing() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const isAdmin = Boolean(localStorage.getItem("admin_token"));

  useEffect(() => {
    fetch("/app/profile").then(res => res.json()).then(data => setProfile(data)).catch();
  }, []);

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    alert("Phone number copied to clipboard!");
  };

  if (!profile) return <div className="p-8 text-center animate-pulse">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-6 border-t border-gray-200 dark:border-gray-800">
        {/* Profile Section */}
        <section className="relative flex flex-col md:flex-row gap-12 items-start mb-32 pt-12">
          {isAdmin && (
            <Link to="/admin" className="absolute top-6 -right-6 p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-full hover:scale-110 transition shadow-sm" title="Edit Profile">
              <Edit2 className="w-5 h-5" />
            </Link>
          )}
          <div className="w-40 h-40 shrink-0">
            <img src={profile.profile_pic || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-800 shadow-xl" />
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{profile.headline || "Hello, I'm a Developer."}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">{profile.about_me}</p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {profile.contact_links?.phone && (
                <button onClick={() => copyPhone(profile.contact_links.phone!)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full font-medium hover:opacity-90 transition shadow-md">
                  <Phone className="w-4 h-4" /> Phone
                </button>
              )}
              {profile.contact_links?.email && (
                <a href={"mailto:" + profile.contact_links.email} className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <Mail className="w-4 h-4" /> Email
                </a>
              )}
              {profile.contact_links?.github && (
                <a href={profile.contact_links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              )}
              {profile.contact_links?.linkedin && (
                <a href={profile.contact_links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Experience & Stack */}
        <section className="grid md:grid-cols-2 gap-16 mb-32 pt-16">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">Experience</h3>
            <div className="prose dark:prose-invert">
              <p className="whitespace-pre-line text-lg leading-relaxed">{profile.experience || "No experience listed yet."}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">Tools / Stack</h3>
            <div className="flex flex-wrap gap-3">
              {profile.stack?.map((tech, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-40 mb-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Portfolio. Built with React & Express.</p>
        </footer>
      </div>
    </>
  );
}
