import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Project } from "../types.ts";
import { Edit2, Github, ExternalLink, ArrowRight } from "lucide-react";

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/app/posts")
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch();
  }, []);

  return (
    <div className="space-y-8 fade-in">
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 pb-2">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 invisible">Project Posts</h2>
        {/* We can hide title since it flows nicely, or just keep it */}
        <Link to="/admin/projects/new" className="absolute top-8 right-8 bg-[#115E59] text-white px-5 py-2.5 rounded-md hover:bg-teal-900 transition font-medium shadow-sm flex items-center gap-2">
          <Edit2 className="w-4 h-4" /> Add New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {projects.length === 0 ? (
          <p className="text-gray-500 italic p-4">No projects exist. Create one!</p>
        ) : projects.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col group relative">
            
            {/* Image Preview Area */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-900 overflow-hidden border-b border-gray-100 dark:border-gray-700">
              {p.display_pic ? (
                <img src={p.display_pic} alt={p.title} className="w-full h-full object-cover transform transition duration-500 ease-in-out group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex justify-center items-center text-gray-400 font-mono">No Image Added</div>
              )}
              
              {/* Floating Edit Button exactly like screenshot */}
              <button 
                onClick={() => navigate("/admin/projects/" + p.id)}
                className="absolute top-4 right-4 bg-[#115E59] text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-teal-900 transition shadow"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Project
              </button>
            </div>

            {/* Card Content Area */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                {p.short_description}
              </p>
              
              <div className="mt-auto flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <a href={p.github_link || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-[#115E59] dark:text-teal-400 hover:text-teal-900 transition">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                  <a href={p.live_link || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-[#115E59] dark:text-teal-400 hover:text-teal-900 transition">
                    <ExternalLink className="w-4 h-4" /> Live link
                  </a>
                </div>
                <ArrowRight className="w-5 h-5 text-[#115E59] dark:text-teal-400" />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
