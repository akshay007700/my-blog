// Trending Page
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Trending.css";

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  views: number;
  likes: number;
  category: string;
  date: string;
}

export default function Trending() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const [timeFilter, setTimeFilter] = useState("today");

  const timeOptions = ["today", "week", "month", "all"];

  useEffect(() => {
    async function loadTrending() {
      setLoading(true);
      try {
        const res = await fetch("/mock/trending.json"); // Replace with API
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.log("Error loading trending articles", err);
      }
      setLoading(false);
    }
    loadTrending();
  }, []);

  return (
    <div className="trending">
      <div className="header">
        <h1 className="title">Trending</h1>
        <p className="subtitle">Most popular articles right now</p>
      </div>

      {/* ---- Time Filter ---- */}
      <div className="time-filter">
        {timeOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setTimeFilter(opt)}
            className={opt === timeFilter ? "time-btn active" : "time-btn"}
          >
            {opt.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <p className="loading">Loading...</p>}

      {!loading && (
        <div className="t-list">
          {articles.map((item, index) => (
            <Link to={`/article/${item.id}`} key={item.id} className="t-card">
              <div className="rank">#{index + 1}</div>

              <img src={item.image} className="thumb" />

              <div className="t-info">
                <span className="badge">{item.category}</span>

                <h2 className="t-title">{item.title}</h2>

                <p className="t-desc">{item.description}</p>

                <div className="t-stats">
                  <span>👁 {item.views.toLocaleString()}</span>
                  <span>❤️ {item.likes}</span>
                  <span>🔥 {Math.round((item.views + item.likes * 10) / 1000)}K</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
