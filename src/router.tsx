import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home/Home";
import Trending from "./pages/Trending/Trending";
import Search from "./pages/Search/Search";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import Settings from "./pages/Settings/Settings";
import Article from "./pages/Article/Article";

// Admin pages
import AdminLogin from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import AddArticle from "./pages/Admin/AddArticle";
import EditArticle from "./pages/Admin/EditArticle";
import ManageArticles from "./pages/Admin/ManageArticles";
import UserManagement from "./pages/Admin/UserManagement";
import Analytics from "./pages/Admin/Analytics";

const router = createBrowserRouter([
  // User side
  { path: "/", element: <Home /> },
  { path: "/trending", element: <Trending /> },
  { path: "/search", element: <Search /> },
  { path: "/bookmarks", element: <Bookmarks /> },
  { path: "/settings", element: <Settings /> },
  { path: "/article/:id", element: <Article /> },

  // Admin side
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/dashboard", element: <Dashboard /> },
  { path: "/admin/add", element: <AddArticle /> },
  { path: "/admin/edit/:id", element: <EditArticle /> },
  { path: "/admin/manage", element: <ManageArticles /> },
  { path: "/admin/users", element: <UserManagement /> },
  { path: "/admin/analytics", element: <Analytics /> },
]);

export default router;
