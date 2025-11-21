// Settings Page
import { useState } from "react";
import "./Settings.css";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      {/* ---- Theme ---- */}
      <div className="setting-box">
        <div>
          <h2 className="s-head">Dark Mode</h2>
          <p className="s-sub">Enable dark theme for better night reading</p>
        </div>

        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* ---- Notifications ---- */}
      <div className="setting-box">
        <div>
          <h2 className="s-head">Notifications</h2>
          <p className="s-sub">Allow important news alerts</p>
        </div>

        <label className="switch">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* ---- Language ---- */}
      <div className="setting-box">
        <div>
          <h2 className="s-head">Language</h2>
          <p className="s-sub">Choose your preferred language</p>
        </div>

        <select
          className="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Marathi</option>
        </select>
      </div>

      {/* ---- About App ---- */}
      <div className="setting-box">
        <div>
          <h2 className="s-head">About App</h2>
          <p className="s-sub">Version 1.0 · Movies Dom News App</p>
        </div>
      </div>

      {/* ---- Developer Info ---- */}
      <div className="setting-box">
        <div>
          <h2 className="s-head">Developer</h2>
          <p className="s-sub">Made with ❤️ by Ellie & Akshay</p>
        </div>
      </div>
    </div>
  );
}
