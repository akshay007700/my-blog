// Bookmarks Page
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Bookmarks.css";

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  views: number;
  likes: number;
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  function removeBookmark(id: string) {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  }

  return (
    <div className="bm-page">
      <h1 className="bm-title">Saved Articles</h1>

      {bookmarks.length === 0 && (
        <div className="bm-empty">
          <p className="bm-empty-icon">🔖</p>
          <h2>No Bookmarks</h2>
          <p>Saved articles will appear here.</p>
        </div>
      )}

      <div className="bm-list">
        {bookmarks.map((item) => (
          <div className="bm-card" key={item.id}>
            <Link to={`/article/${item.id}`} className="bm-link">
              <img src={item.image} className="bm-img" />
              <div className="bm-info">
                <span className="bm-cat">{item.category}</span>
                <h2 className="bm-heading">{item.title}</h2>
                <p className="bm-desc">{item.description}</p>

                <div className="bm-stats">
                  <span>👁 {item.views}</span>
                  <span>❤️ {item.likes}</span>
                </div>
              </div>
            </Link>

            <button
              className="bm-remove"
              onClick={() => removeBookmark(item.id)}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
