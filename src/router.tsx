// router file
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard"; // Next page

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "trending", element: <Trending /> },
      { path: "search", element: <Search /> },
      { path: "bookmarks", element: <Bookmarks /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  // Admin
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> }
  import AddArticle from "./pages/Admin/AddArticle";

{ path: "/admin/add-article", element: <AddArticle /> }
import EditArticle from "./pages/Admin/EditArticle";
import ManageArticles from "./pages/Admin/ManageArticles";

{ path: "/admin/manage", element: <ManageArticles /> }
import UserManagement from "./pages/Admin/UserManagement";

{ path: "/admin/users", element: <UserManagement /> }
import Analytics from "./pages/Admin/Analytics";

{ path: "/admin/analytics", element: <Analytics /> }

{ path: "/admin/edit/:id", element: <EditArticle /> }


]);
