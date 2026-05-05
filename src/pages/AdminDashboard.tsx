import { useEffect } from "react";
import { Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle.tsx";
import { AdminProfile } from "./AdminProfile.tsx";
import { AdminProjects } from "./AdminProjects.tsx";
import { AdminProjectForm } from "./AdminProjectForm.tsx";
import { AdminSettings } from "./AdminSettings.tsx";

export function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const navClass = (path: string) => {
    const isActive = path === "/admin" 
      ? location.pathname === "/admin" 
      : location.pathname.startsWith(path);
      
    return isActive
      ? "text-[#115e59] dark:text-teal-400 border-b-2 border-[#115e59] dark:border-teal-400 pb-1 font-semibold"
      : "text-gray-500 dark:text-gray-400 hover:text-[#115e59] dark:hover:text-teal-400 transition font-medium pb-1 border-b-2 border-transparent";
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      <header className="flex flex-wrap justify-between items-center py-4 px-4 sm:px-8 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 gap-y-4">
        <nav className="flex flex-wrap items-center gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/admin" className={navClass("/admin")}>My Profile</Link>
          <Link to="/admin/projects" className={navClass("/admin/projects")}>Project Posts</Link>
          <Link to="/admin/settings" className={navClass("/admin/settings")}>Settings</Link>
        </nav>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0">
          <Link to="/" className="text-sm font-medium text-gray-500 hover:text-teal-700 transition">View Live Site</Link>
          <button 
            onClick={() => { localStorage.removeItem("admin_token"); navigate("/"); }}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Sign Out
          </button>
          <ThemeToggle />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-8 py-12">
        <Routes>
          <Route path="/" element={<AdminProfile />} />
          <Route path="/projects" element={<AdminProjects />} />
          <Route path="/projects/new" element={<AdminProjectForm />} />
          <Route path="/projects/:id" element={<AdminProjectForm />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
}
