import { RouterProvider } from "react-router-dom";
import router from "./router";

import { ThemeProvider } from "./contexts/ThemeContext";
import { NewsProvider } from "./contexts/NewsContext";
import { AdminProvider } from "./contexts/AdminContext";
import { AutoNewsProvider } from "./contexts/AutoNewsContext";

export default function App() {
  return (
    <ThemeProvider>
      <NewsProvider>
        <AdminProvider>
          <AutoNewsProvider>
            <RouterProvider router={router} />
          </AutoNewsProvider>
        </AdminProvider>
      </NewsProvider>
    </ThemeProvider>
  );
}
