import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { DatabaseSync } from "node:sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

const DB_PATH = path.join(__dirname, 'portfolio.db');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});
const upload = multer({ storage: storage });

function setupDb() {
  const db = new DatabaseSync(DB_PATH);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      headline TEXT,
      about_me TEXT,
      stack TEXT,
      experience TEXT,
      contact_links TEXT,
      chat_enabled INTEGER DEFAULT 1,
      profile_pic TEXT
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      short_description TEXT,
      description TEXT,
      github_link TEXT,
      live_link TEXT,
      display_pic TEXT,
      additional_media TEXT
    );
  `);

  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  if (!profile) {
    db.prepare('INSERT INTO profile (id, headline, about_me, stack, contact_links, chat_enabled, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      1, "New Portfolio", "Update me.", "[]", "{}", 1, ""
    );
  }
  
  return db;
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use('/uploads', express.static(UPLOADS_DIR));

  const db = setupDb();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

  // Auth Middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.split(" ")[1] !== ADMIN_PASSWORD) {
      res.status(401).json({ detail: "Invalid token" });
      return;
    }
    next();
  };

  // UPLOAD MEDIA
  app.post("/app/upload", requireAdmin, upload.single("file"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ detail: "No file uploaded" });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  // AUTH
  app.post("/app/auth/login", (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) {
      res.json({ access_token: req.body.password, token_type: "bearer" });
      return;
    }
    res.status(401).json({ detail: "Invalid password" });
    return;
  });

  // PROFILE
  app.get("/app/profile", (req, res) => {
    try {
      const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get() as any;
      if (profile) {
        profile.stack = profile.stack ? JSON.parse(profile.stack) : [];
        profile.contact_links = profile.contact_links ? JSON.parse(profile.contact_links) : {};
        profile.chat_enabled = Boolean(profile.chat_enabled);
      }
      res.json(profile || { id: 1, headline: "New Portfolio", about_me: "Update me.", stack: [], contact_links: {} });
    } catch(err) {
      res.status(500).json({ detail: "Internal Server Error" });
    }
  });

  app.put("/app/profile", requireAdmin, (req, res) => {
    try {
      const p = req.body;
      
      const stmt = db.prepare(
        `UPDATE profile SET headline=?, about_me=?, stack=?, experience=?, contact_links=?, chat_enabled=?, profile_pic=? WHERE id=1`
      );
      stmt.run(
        p.headline || "", 
        p.about_me || "", 
        JSON.stringify(p.stack || []), 
        p.experience || "", 
        JSON.stringify(p.contact_links || {}), 
        p.chat_enabled ? 1 : 0,
        p.profile_pic || ""
      );
      
      res.json({ success: true });
    } catch(err) {
      console.error(err);
      res.status(500).json({ detail: "Internal Server Error" });
    }
  });

  // POSTS
  app.get("/app/posts", (req, res) => {
    try {
      const projects = db.prepare('SELECT * FROM projects').all() as any[];
      projects.forEach(p => {
        try { p.additional_media = p.additional_media ? JSON.parse(p.additional_media) : []; } catch(e) { p.additional_media = []; }
      });
      res.json(projects);
    } catch (err) {
      console.error(err);
      res.status(500).json({ detail: "Internal Server Error" });
    }
  });

  app.get("/app/posts/:id", (req, res) => {
    try {
      const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id) as any;
      if (!project) {
        res.status(404).json({ detail: "Project not found" });
        return;
      }
      try { project.additional_media = project.additional_media ? JSON.parse(project.additional_media) : []; } catch(e) { project.additional_media = []; }
      res.json(project);
    } catch(err) {
      res.status(500).json({ detail: "Internal Server Error" });
    }
  });

  app.post("/app/posts", requireAdmin, (req, res) => {
    try {
      const p = req.body;
      
      const stmt = db.prepare(`
        INSERT INTO projects (title, short_description, description, github_link, live_link, display_pic, additional_media) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        p.title || "", 
        p.short_description || "", 
        p.description || "", 
        p.github_link || "", 
        p.live_link || "", 
        p.display_pic || "", 
        JSON.stringify(p.additional_media || [])
      );
      
      const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid) as any;
      if (newProject) {
          try { newProject.additional_media = newProject.additional_media ? JSON.parse(newProject.additional_media) : []; } catch(e){ newProject.additional_media = []; }
      }
      res.json(newProject);
    } catch(err) {
      console.error(err);
      res.status(500).json({ detail: "Internal Server Error" });
    }
  });

  app.put("/app/posts/:id", requireAdmin, (req, res) => {
    try {
      const p = req.body;
      
      const stmt = db.prepare(`
        UPDATE projects SET title=?, short_description=?, description=?, github_link=?, live_link=?, display_pic=?, additional_media=? WHERE id=?
      `);
      stmt.run(
        p.title || "", 
        p.short_description || "", 
        p.description || "", 
        p.github_link || "", 
        p.live_link || "", 
        p.display_pic || "", 
        JSON.stringify(p.additional_media || []), 
        req.params.id
      );
      
      res.json({ success: true });
    } catch(err) {
      console.error(err);
      res.status(500).json({ detail: "Internal Server Error" });
    }
  });

  app.delete("/app/posts/:id", requireAdmin, (req, res) => {
    try {
      db.prepare('DELETE FROM projects WHERE id=?').run(req.params.id);
      res.json({ success: true });
    } catch(err) {
      res.status(500).json({ detail: "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("Node server running on http://localhost:" + PORT);
  });
}

startServer();

