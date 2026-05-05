import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Project } from "../types.ts";

export function AdminProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [project, setProject] = useState<Partial<Project>>({
    title: "",
    short_description: "",
    description: "",
    display_pic: "",
    live_link: "",
    github_link: "",
    additional_media: [],
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetch("/app/posts/" + id)
        .then(res => res.json())
        .then(data => setProject(data))
        .catch();
    }
  }, [id, isEdit]);

  const handleChange = (field: keyof Project, value: any) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaChange = (value: string) => {
    setProject(prev => ({
      ...prev,
      additional_media: value.split(",").map(i => i.trim()).filter(Boolean)
    }));
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    setUploading(true);
    setMsg("Uploading...");
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

  const handleDisplayPicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      if (url) handleChange("display_pic", url);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const urls: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const url = await uploadFile(e.target.files[i]);
        if (url) urls.push(url);
      }
      if (urls.length > 0) {
        setProject(prev => ({
          ...prev,
          additional_media: [...(prev.additional_media || []), ...urls]
        }));
      }
    }
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const url = isEdit ? "/app/posts/" + id : "/app/posts";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("admin_token")
        },
        body: JSON.stringify(project)
      });
      if (res.ok) {
        setMsg("Saved successfully!");
        if (!isEdit) {
          navigate("/admin/projects");
        }
      } else {
        setMsg("Error saving project");
      }
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{isEdit ? "Edit Project" : "New Project"}</h2>
        <Link to="/admin/projects" className="text-sm border border-gray-300 dark:border-gray-700 px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          Cancel
        </Link>
      </div>

      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input required className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={project.title} onChange={e => handleChange("title", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <input required className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={project.short_description} onChange={e => handleChange("short_description", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Description (Markdown/Text)</label>
          <textarea rows={6} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={project.description} onChange={e => handleChange("description", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Display Image (Upload or specify URL)</label>
          <div className="flex gap-2 mb-2">
             <input type="file" accept="image/*" onChange={handleDisplayPicUpload} className="text-sm cursor-pointer" disabled={uploading}/>
          </div>
          <input placeholder="Or enter image URL here" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={project.display_pic} onChange={e => handleChange("display_pic", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Live Link URL</label>
          <input className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={project.live_link} onChange={e => handleChange("live_link", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GitHub Link URL</label>
          <input className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={project.github_link} onChange={e => handleChange("github_link", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gallery Images (Upload multiple or enter comma-separated URLs)</label>
          <div className="flex gap-2 mb-2">
             <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="text-sm cursor-pointer" disabled={uploading}/>
          </div>
          <input placeholder="Or enter multiple URLs" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={project.additional_media?.join(", ") || ""} onChange={e => handleMediaChange(e.target.value)} />
        </div>

        <div className="flex gap-4 items-center mt-6 pt-6 border-t dark:border-gray-800">
          <button type="submit" disabled={saving || uploading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium">
            {saving ? "Saving..." : "Save Project"}
          </button>
          {msg && <p className={msg.includes("Error") ? "text-red-500" : (msg === "Uploading..." ? "text-blue-500" : "text-green-500")}>{msg}</p>}
        </div>
      </form>
    </div>
  );
}
