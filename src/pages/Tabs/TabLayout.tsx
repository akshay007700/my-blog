// Tab Layout
import { NavLink } from "react-router-dom";
import "./TabLayout.css";
import { AiFillHome } from "react-icons/ai";
import { MdTrendingUp, MdSearch, MdBookmark, MdSettings } from "react-icons/md";

export default function TabLayout() {
  return (
    <div className="tab-layout">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "tab-item active" : "tab-item")}
      >
        <AiFillHome size={24} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/trending"
        className={({ isActive }) =>
          isActive ? "tab-item active" : "tab-item"
        }
      >
        <MdTrendingUp size={24} />
        <span>Trending</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          isActive ? "tab-item active" : "tab-item"
        }
      >
        <MdSearch size={24} />
        <span>Search</span>
      </NavLink>

      <NavLink
        to="/bookmarks"
        className={({ isActive }) =>
          isActive ? "tab-item active" : "tab-item"
        }
      >
        <MdBookmark size={24} />
        <span>Saved</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? "tab-item active" : "tab-item"
        }
      >
        <MdSettings size={24} />
        <span>Settings</span>
      </NavLink>
    </div>
  );
}
