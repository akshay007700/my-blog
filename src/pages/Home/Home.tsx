// Home Page
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // optional styling

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  const categories = ["All", "Tech", "Sports", "Gaming", "AI", "Politics"];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch("/mock/home.json"); // you can replace with API
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.log("Error loading", err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered =
    category === "All"
      ? articles
      : articles.filter((a) => a.category === category);

  return (
    <div className="home">
      {/* ----------- Header ----------- */}
      <div className="home-header">
        <h1 className="title">Top Headlines</h1>

        <div className="category-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cat === category ? "cat active" : "cat"}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ----------- Loading ----------- */}
      {loading && <p className="loading">Loading Articles...</p>}

      {/* ----------- Article List ----------- */}
      <div className="articles">
        {filtered.map((item) => (
          <Link
            key={item.id}
            to={`/article/${item.id}`}
            className="card"
          >
            <img src={item.image} className="thumbnail" />

            <div className="card-info">
              <span className="cat-tag">{item.category}</span>
              <h2 className="card-title">{item.title}</h2>
              <p className="card-description">{item.description}</p>
              <span className="date">{item.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
