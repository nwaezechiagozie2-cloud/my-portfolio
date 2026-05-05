import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { type Project } from "../types.ts";
import { Github, Globe } from "lucide-react";
import { Navbar } from "../components/Navbar.tsx";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/app/posts/" + id).then(res => res.json()).then(data => setProject(data)).catch();
  }, [id]);

  if (!project) return <div className="p-8 text-center animate-pulse">Loading project...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-6 border-t border-gray-200 dark:border-gray-800">
        <Link to="/projects" className="inline-block text-sm font-medium hover:underline text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition mb-12">
          ← Back to Projects
        </Link>
        
        <main>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">{project.title}</h1>
          
          <div className="flex gap-4 mb-12">
            {project.live_link && (
              <a href={project.live_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
                <Globe className="w-4 h-4" /> View Live
              </a>
            )}
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
          </div>

          {project.display_pic && (
            <div className="w-full aspect-video overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-xl mb-16">
              <img src={project.display_pic} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none mb-16 text-lg leading-relaxed">
            <p className="whitespace-pre-line">{project.description}</p>
          </div>

          {project.additional_media && project.additional_media.length > 0 && (
            <section>
              <h3 className="text-xl font-bold tracking-tight border-b border-gray-200 dark:border-gray-800 pb-4 mb-8">Media Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.additional_media.map((media, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                    <img src={media} alt={"Gallery " + idx} className="w-full h-auto object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
