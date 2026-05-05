import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("admin_token", data.access_token);
        navigate("/admin");
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleLogin} className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-xl max-w-sm w-full border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-md mb-4 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#115E59] focus:outline-none transition"
          placeholder="Enter Admin Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}
        <div className="flex flex-col gap-3">
          <button type="submit" className="w-full bg-[#115E59] text-white py-2.5 rounded-md hover:bg-teal-900 transition font-semibold">
            Login
          </button>
          <button type="button" onClick={() => navigate("/")} className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
