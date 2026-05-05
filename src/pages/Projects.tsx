import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { type Project } from "../types.ts";
import { Edit2 } from "lucide-react";
import { Navbar } from "../components/Navbar.tsx";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const isAdmin = Boolean(localStorage.getItem("admin_token"));

  useEffect(() => {
    fetch("/app/posts").then(res => res.json()).then(data => {
      setProjects(Array.isArray(data) ? data : []);
    }).catch();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-6 border-t border-gray-200 dark:border-gray-800">
        <section>
          <div className="flex flex-wrap justify-between items-baseline gap-4 mb-12">
            <h3 className="text-3xl font-bold tracking-tight">All Projects</h3>
            {isAdmin && (
              <Link to="/admin/projects/new" className="text-sm font-medium text-[#115E59] dark:text-teal-400 hover:underline whitespace-nowrap">
                + New Project
              </Link>
            )}
          </div>
          
          <div className="flex flex-col gap-24">
            {projects.length === 0 ? (
              <p className="text-gray-500 italic">No projects added yet.</p>
            ) : projects.map(p => (
              <div key={p.id} className="relative group rounded-2xl p-6 -mx-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition duration-300 flex flex-col md:flex-row gap-10 items-center">
                {isAdmin && (
                  <Link to={"/admin/projects/" + p.id} className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/80 backdrop-blur text-[#115E59] dark:text-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm" title="Edit Project">
                    <Edit2 className="w-5 h-5" />
                  </Link>
                )}
                {p.display_pic && (
                  <Link to={"/project/" + p.id} className="w-full md:w-1/2 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg aspect-video shrink-0 block">
                    <img src={p.display_pic} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" />
                  </Link>
                )}
                <div className="flex-1 space-y-4">
                  <Link to={"/project/" + p.id}>
                    <h4 className="text-2xl font-bold hover:text-[#115E59] dark:hover:text-teal-400 transition">{p.title}</h4>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{p.short_description}</p>
                  <div className="flex gap-4 pt-2">
                    {p.live_link && (
                      <a href={p.live_link} target="_blank" rel="noreferrer" className="text-sm font-medium uppercase tracking-wider hover:text-[#115E59] dark:hover:text-teal-400 transition">View Live →</a>
                    )}
                    {p.github_link && (
                      <a href={p.github_link} target="_blank" rel="noreferrer" className="text-sm font-medium uppercase tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition">GitHub</a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-40 mb-12 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Portfolio. Built with React & Express.</p>
        </footer>
      </div>
    </>
  );
}
