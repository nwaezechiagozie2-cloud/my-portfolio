import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle.tsx";

export function Navbar() {
  const isAdmin = Boolean(localStorage.getItem("admin_token"));

  return (
    <header className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center mb-8">
      <Link to="/" className="text-xl font-bold font-mono tracking-tighter hover:opacity-80 transition">
        Portfolio.
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm font-medium hover:text-[#115E59] dark:hover:text-teal-400 transition">About</Link>
        <Link to="/projects" className="text-sm font-medium hover:text-[#115E59] dark:hover:text-teal-400 transition">Projects</Link>
        {isAdmin ? (
          <Link to="/admin" className="text-sm border border-gray-300 dark:border-gray-700 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition">Admin</Link>
        ) : (
          <Link to="/admin/login" className="text-sm opacity-50 hover:opacity-100 transition">Admin login</Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
