import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface Article {
  id: string;
  title: string;
  category: string;
  views: number;
  likes: number;
  image: string;
  date: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const admin = localStorage.getItem("adminLogged");
    if (!admin) navigate("/admin/login");

    async function loadData() {
      const res = await fetch("/mock/articles.json");
      const data = await res.json();
      setArticles(data);
    }

    loadData();
  }, []);

  function logout() {
    localStorage.removeItem("adminLogged");
    navigate("/admin/login");
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sb-title">Admin Panel</h2>

        <div className="sb-links">
          <button className="sb-btn active">Dashboard</button>
          <button className="sb-btn">Add Article</button>
          <button className="sb-btn">Manage News</button>
          <button className="sb-btn">Users</button>
          <button className="sb-btn">Analytics</button>
          <button
  className="edit-btn"
  onClick={() => navigate(`/admin/edit/${a.id}`)}
>
  Edit
</button>
<button onClick={() => navigate("/admin/add-article")} className="sb-btn">
  Add Article
</button>
<button onClick={() => navigate("/admin/manage")} className="sb-btn">
  Manage Articles
</button>
<button onClick={() => navigate("/admin/analytics")} className="sb-btn">
  Analytics
</button>
<button onClick={() => navigate("/admin/users")} className="sb-btn">
  Users
</button>


        </div>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <h1 className="db-title">Dashboard Overview</h1>

        {/* Stats Boxes */}
        <div className="stats-grid">
          <div className="stat-box">
            <h2>{articles.length}</h2>
            <p>Total Articles</p>
          </div>

          <div className="stat-box">
            <h2>
              {articles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
            </h2>
            <p>Total Views</p>
          </div>

          <div className="stat-box">
            <h2>
              {articles.reduce((sum, a) => sum + a.likes, 0).toLocaleString()}
            </h2>
            <p>Total Likes</p>
          </div>
           

          <div className="stat-box">
            <h2>152</h2>
            <p>Active Users</p>
          </div>
