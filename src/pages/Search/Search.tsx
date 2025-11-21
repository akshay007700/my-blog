// Search Page
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./Search.css";

interface Article {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  image: string;
  views: number;
  likes: number;
}

const categories = [
  "All",
  "National",
  "International",
  "Sports",
  "Tech",
  "Entertainment",
  "Business",
  "Health",
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchData, setSearchData] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");

  async function searchNow(q: string) {
    setQuery(q);

    if (!q.trim()) {
      setSearchData([]);
      return;
    }

    try {
      const res = await fetch("/mock/search.json"); // Replace with real API
      const data = await res.json();

      setSearchData(
        data.filter(
          (item: Article) =>
            item.title.toLowerCase().includes(q.toLowerCase()) ||
            item.description.toLowerCase().includes(q.toLowerCase()) ||
            item.author.toLowerCase().includes(q.toLowerCase())
        )
      );
    } catch (err) {
      console.error("Search Error", err);
    }
  }

  // Filter + Sort Logic
  const filtered = useMemo(() => {
    let res = [...searchData];

    if (selectedCategory !== "All") {
      res = res.filter((a) => a.category === selectedCategory);
    }

    switch (sortBy) {
      case "date":
        return res.sort((a, b) => b.views - a.views);
      case "views":
        return res.sort((a, b) => b.views - a.views);
      default:
        return res;
    }
  }, [searchData, selectedCategory, sortBy]);

  return (
    <div className="search-page">
      <h1 className="s-title">Search</h1>

      {/* Search Input */}
      <div className="s-bar">
        <input
          placeholder="Search news, authors, topics..."
          value={query}
          onChange={(e) => searchNow(e.target.value)}
        />
        {query.length > 0 && (
          <button onClick={() => searchNow("")} className="clear-btn">
            ✖
          </button>
        )}
      </div>

      {/* Filters */}
      {query.length > 0 && (
        <>
          {/* Categories */}
          <div className="category-list">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "cat-btn active" : "cat-btn"}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="sort-bar">
            <span>Sort by:</span>
            {["relevance", "date", "views"].map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={sortBy === s ? "sort-btn active" : "sort-btn"}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Empty States */}
      {query.length === 0 && (
        <p className="placeholder">Search for news and articles</p>
      )}

      {query.length > 0 && filtered.length === 0 && (
        <p className="placeholder">No Results Found</p>
      )}

      {/* Results */}
      <div className="result-list">
        {filtered.map((item) => (
          <Link to={`/article/${item.id}`} key={item.id} className="result-card">
            <img src={item.image} className="r-image" />

            <div className="r-info">
              <span className="r-cat">{item.category}</span>
              <h2 className="r-title">{item.title}</h2>
              <p className="r-desc">{item.description}</p>

              <div className="r-meta">
                <span>👁 {item.views}</span>
                <span>❤️ {item.likes}</span>
                <span>✍ {item.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
