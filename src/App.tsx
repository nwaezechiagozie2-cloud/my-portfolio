/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing.tsx";
import { Projects } from "./pages/Projects.tsx";
import { ProjectDetail } from "./pages/ProjectDetail.tsx";
import { AdminLogin } from "./pages/AdminLogin.tsx";
import { AdminDashboard } from "./pages/AdminDashboard.tsx";
import { ChatWidget } from "./components/ChatWidget.tsx";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
        <ChatWidget />
      </div>
    </Router>
  );
}
