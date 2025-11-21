import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditArticle.css";

interface ArticleType {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  image: string;
  date: string;
  author: string;
  views: number;
  likes: number;
}

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("articles");
    const list: ArticleType[] = saved ? JSON.parse(saved) : [];

    const found = list.find((a) => a.id === id);
    setArticle(found || null);
    setImagePreview(found?.image || null);

    setLoading(false);
  }, [id]);

  function updateArticle() {
    if (!article) return;

    const saved = localStorage.getItem("articles");
    let list: ArticleType[] = saved ? JSON.parse(saved) : [];

    list = list.map((a) => (a.id === id ? article : a));

    localStorage.setItem("articles", JSON.stringify(list));

    alert("Article Updated!");
    navigate("/admin/dashboard");
  }

  function handleImageUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setArticle((prev) =>
        prev ? { ...prev, image: reader.result as string } : prev
      );
    };
    reader.readAsDataURL(file);
  }

  if (loading) return <p className="edit-loading">Loading...</p>;
  if (!article) return <p>Article Not Found</p>;

  return (
    <div className="edit-page">
      <h1 className="edit-title">Edit Article</h1>

      <div className="edit-form">
        <input
          type="text"
          className="edit-input"
          value={article.title}
          onChange={(e) =>
            setArticle({ ...article, title: e.target.value })
          }
        />

        <textarea
          className="edit-input textarea"
          value={article.description}
          onChange={(e) =>
            setArticle({ ...article, description: e.target.value })
          }
        />

        <select
          className="edit-input"
          value={article.category}
          onChange={(e) =>
            setArticle({ ...article, category: e.target.value })
          }
        >
          <option>General</option>
          <option>Tech</option>
          <option>Sports</option>
          <option>Business</option>
          <option>Entertainment</option>
          <option>Health</option>
        </select>

        {/* Image upload */}
        <div className="image-section">
          <label className="upload-btn">
            Change Image
            <input type="file" accept="image/*" onChange={handleImageUpdate} />
          </label>

          {imagePreview && <img src={imagePreview} className="preview-img" />}
        </div>

        <textarea
          className="edit-input textarea big"
          value={article.content}
          onChange={(e) =>
            setArticle({ ...article, content: e.target.value })
          }
        />

        <button className="save-btn" onClick={updateArticle}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
