import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./Analytics.css";

interface Article {
  id: string;
  title: string;
  category: string;
  views: number;
  likes: number;
  date: string;
}

export default function Analytics() {
  const [articles, setArticles] = useState<Article[]>([]);
  const COLORS = ["#FF5733", "#4287f5", "#33cc5e", "#bc33f6", "#ffbb33"];

  useEffect(() => {
    const saved = localStorage.getItem("articles");
    setArticles(saved ? JSON.parse(saved) : []);
  }, []);

  // Total Stats
  const totalViews = articles.reduce((s, a) => s + a.views, 0);
  const totalLikes = articles.reduce((s, a) => s + a.likes, 0);

  // Category Analytics
  const categoryData = Object.values(
    articles.reduce((acc: any, article) => {
      if (!acc[article.category]) {
        acc[article.category] = { category: article.category, views: 0 };
      }
      acc[article.category].views += article.views;
      return acc;
    }, {})
  );

  // Trending Articles Chart (Top 5)
  const trending = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((a) => ({ title: a.title, views: a.views }));

  // Fake Daily Analytics for Line Chart
  const daily = [
    { day: "Mon", views: totalViews * 0.1 },
    { day: "Tue", views: totalViews * 0.15 },
    { day: "Wed", views: totalViews * 0.2 },
    { day: "Thu", views: totalViews * 0.18 },
    { day: "Fri", views: totalViews * 0.25 },
    { day: "Sat", views: totalViews * 0.08 },
    { day: "Sun", views: totalViews * 0.12 },
  ];

  return (
    <div className="analytics-page">
      <h1 className="an-title">Admin Analytics</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-box">
          <h2>{articles.length}</h2>
          <p>Total Articles</p>
        </div>
        <div className="stat-box">
          <h2>{totalViews.toLocaleString()}</h2>
          <p>Total Views</p>
        </div>
        <div className="stat-box">
          <h2>{totalLikes.toLocaleString()}</h2>
          <p>Total Likes</p>
        </div>
        <div className="stat-box">
          <h2>152</h2>
          <p>Total Users</p>
        </div>
      </div>

      {/* Line Chart – Daily Views */}
      <div className="chart-box">
        <h3>Daily Views</h3>
        <LineChart width={750} height={280} data={daily}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="#000" strokeWidth={2} />
        </LineChart>
      </div>

      {/* Bar Chart – Top Articles */}
      <div className="chart-box">
        <h3>Top 5 Articles (Views)</h3>
        <BarChart width={750} height={300} data={trending}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#000" />
        </BarChart>
      </div>

      {/* Pie Chart – Category Analytics */}
      <div className="chart-box">
        <h3>Views by Category</h3>
        <PieChart width={750} height={300}>
          <Pie
            data={categoryData}
            cx={350}
            cy={150}
            outerRadius={120}
            fill="#000"
            dataKey="views"
            label
          >
            {categoryData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
