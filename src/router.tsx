import { createBrowserRouter } from "react-router-dom";

// PAGES
import Home from "./pages/Home/Home";
import Trending from "./pages/Trending/Trending";
import Search from "./pages/Search/Search";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import Settings from "./pages/Settings/Settings";

// ADMIN
import Login from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import Analytics from "./pages/Admin/Analytics";

// LAYOUT
import TabLayout from "./pages/Tabs/TabLayout";

const BASE = "/my-blog";

const router = createBrowserRouter([
  // Main Tabs
  { path: `${BASE}/`, element: <TabLayout /> },
  { path: `${BASE}/trending`, element: <Trending /> },
  { path: `${BASE}/search`, element: <Search /> },
  { path: `${BASE}/bookmarks`, element: <Bookmarks /> },
  { path: `${BASE}/settings`, element: <Settings /> },

  // Admin
  { path: `${BASE}/admin`, element: <AdminDashboard /> },
  { path: `${BASE}/admin/login`, element: <Login /> },
  { path: `${BASE}/admin/analytics`, element: <Analytics /> },

  // Fallback
  { path: `${BASE}/*`, element: <div>404 Not Found</div> },
]);

export default router;
