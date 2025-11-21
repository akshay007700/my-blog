import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageArticles.css";

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  views: number;
  likes: number;
  image: string;
}

export default function ManageArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("articles");
    const list = saved ? JSON.parse(saved) : [];
    setArticles(list);
  }, []);

  function deleteArticle(id: string) {
    if (!confirm("Delete this article?")) return;

    const updated = articles.filter((a) => a.id !== id);

    setArticles(updated);
    localStorage.setItem("articles", JSON.stringify(updated));
  }

  return (
    <div className="manage-page">
      <h1 className="manage-title">Manage Articles</h1>

      {articles.length === 0 && (
        <p className="no-articles">No Articles Found</p>
      )}

      <table className="article-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>
                <img src={a.image} className="table-img" />
              </td>

              <td>{a.title}</td>
              <td>{a.category}</td>
              <td>{a.date}</td>
              <td>{a.views}</td>
              <td>{a.likes}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/admin/edit/${a.id}`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteArticle(a.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
