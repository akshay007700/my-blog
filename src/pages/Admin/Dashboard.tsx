import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface Article {
  id: string;
  title: string;
  views: number;
  likes: number;
  image: string;
  date: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("articles");
    const list: Article[] = saved ? JSON.parse(saved) : [];

    setArticles(list);

    setTotalViews(list.reduce((s, a) => s + a.views, 0));
    setTotalLikes(list.reduce((s, a) => s + a.likes, 0));
  }, []);

  return (
    <div className="admin-dashboard">

      <h1 className="db-title">Admin Dashboard</h1>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <h2>{articles.length}</h2>
          <p>Total Articles</p>
        </div>

        <div className="stat-card">
          <h2>{totalViews}</h2>
          <p>Total Views</p>
        </div>

        <div className="stat-card">
          <h2>{totalLikes}</h2>
          <p>Total Likes</p>
        </div>

        <div className="stat-card">
          <h2>152</h2>
          <p>Total Users</p>
        </div>

      </div>


      {/* ACTION BUTTONS */}
      <div className="dashboard-actions">

        <button
          className="db-btn"
          onClick={() => navigate("/admin/add")}
        >
          ➕ Add Article
        </button>

        <button
          className="db-btn"
          onClick={() => navigate("/admin/manage")}
        >
          📦 Manage Articles
        </button>

        <button
          className="db-btn"
          onClick={() => navigate("/admin/users")}
        >
          👤 Manage Users
        </button>

        <button
          className="db-btn"
          onClick={() => navigate("/admin/analytics")}
        >
          📊 Analytics
        </button>

      </div>


      {/* RECENT ARTICLES SECTION */}
      <h2 className="sub-title">Recent Articles</h2>

      <div className="recent-list">

        {articles.slice(0, 5).map((a) => (
          <div key={a.id} className="recent-item">

            <img src={a.image} className="recent-img" />

            <div className="recent-info">
              <h4>{a.title}</h4>
              <span>{a.date}</span>
            </div>

          </div>
        ))}

        {articles.length === 0 && (
          <p>No Articles Added</p>
        )}

      </div>


    </div>
  );
}
