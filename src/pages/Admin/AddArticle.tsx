import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddArticle.css";

export default function AddArticle() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function publishArticle() {
    if (!title || !desc || !content) {
      alert("Please fill all fields!");
      return;
    }

    const newArticle = {
      id: Date.now().toString(),
      title,
      description: desc,
      category,
      content,
      image,
      date: new Date().toISOString().split("T")[0],
      author: "Admin",
      views: 0,
      likes: 0,
    };

    // Save locally (your mock backend)
    const saved = localStorage.getItem("articles");
    const list = saved ? JSON.parse(saved) : [];
    list.push(newArticle);

    localStorage.setItem("articles", JSON.stringify(list));

    alert("Article Published!");
    navigate("/admin/dashboard");
  }

  return (
    <div className="add-article-page">
      <h1 className="add-title">Add New Article</h1>

      <div className="add-form">
        {/* Title */}
        <input
          type="text"
          placeholder="Article Title"
          className="add-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          className="add-input textarea"
          placeholder="Short Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* Category */}
        <select
          className="add-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>General</option>
          <option>Tech</option>
          <option>Sports</option>
          <option>Business</option>
          <option>Entertainment</option>
          <option>Health</option>
        </select>

        {/* Image Upload */}
        <div className="image-section">
          <label className="upload-btn">
            Upload Image
            <input type="file" accept="image/*" onChange={handleImage} />
          </label>

          {image && <img src={image} className="preview-img" />}
        </div>

        {/* Content (Full Article HTML) */}
        <textarea
          className="add-input textarea big"
          placeholder="Full article content (HTML supported)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Publish */}
        <button className="publish-btn" onClick={publishArticle}>
          Publish Article
        </button>
      </div>
    </div>
  );
}
