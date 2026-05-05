import fs from "fs";
import path from "path";

function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf-8");
  content = content.replace(/\\\`/g, "\`");
  content = content.replace(/\\\$/g, "\$");
  fs.writeFileSync(filePath, content);
}

fixFile("src/pages/Landing.tsx");
fixFile("src/pages/ProjectDetail.tsx");
fixFile("src/pages/AdminProfile.tsx");
fixFile("src/pages/AdminProjects.tsx");
fixFile("src/pages/AdminProjectForm.tsx");
fixFile("server.ts");
console.log("Fixes complete!");
