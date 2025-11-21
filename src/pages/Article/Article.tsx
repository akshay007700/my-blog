import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Article.css";

interface ArticleType {
  id: string;
  title: string;
  content: string;
  description: string;
  image: string;
  category: string;
  date: string;
  author: string;
  views: number;
  likes: number;
}

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/mock/articles.json"); // Replace with actual API
      const data = await res.json();

      const found = data.find((a: ArticleType) => a.id === id);
      setArticle(found || null);

      setLoading(false);

      // Check bookmark
      const saved = localStorage.getItem("bookmarks");
      if (saved) {
        const list = JSON.parse(saved);
        setBookmarked(list.some((b: ArticleType) => b.id === id));
      }
    }
    load();
  }, [id]);

  function toggleBookmark() {
    const saved = localStorage.getItem("bookmarks");
    let list = saved ? JSON.parse(saved) : [];

    if (bookmarked) {
      list = list.filter((b: ArticleType) => b.id !== id);
    } else {
      if (article) list.push(article);
    }

    localStorage.setItem("bookmarks", JSON.stringify(list));
    setBookmarked(!bookmarked);
  }

  if (loading) return <p className="a-loading">Loading article...</p>;
  if (!article) return <p>Article Not Found</p>;

  return (
    <div className="article-page">
      <img src={article.image} className="a-image" />

      <div className="a-info">
        <span className="a-cat">{article.category}</span>
        <h1 className="a-title">{article.title}</h1>

        <div className="a-meta">
          <span>✍ {article.author}</span>
          <span>📅 {article.date}</span>
          <span>👁 {article.views}</span>
          <span>❤️ {article.likes}</span>
        </div>

        <button onClick={toggleBookmark} className="a-bookmark">
          {bookmarked ? "Remove Bookmark" : "Save Article"}
        </button>

        <p className="a-desc">{article.description}</p>

        <div
          className="a-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      <hr className="a-line" />

      <h2 className="related-title">Related Articles</h2>

      <div className="related-list">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="related-card">
            <div className="sk-img"></div>
            <div className="sk-line"></div>
            <div className="sk-line small"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
