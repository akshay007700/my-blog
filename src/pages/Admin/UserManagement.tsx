import { useEffect, useState } from "react";
import "./UserManagement.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("users");
    if (saved) {
      setUsers(JSON.parse(saved));
    } else {
      // Default dummy users (first time)
      const dummy = [
        {
          id: "1",
          name: "Akshay",
          email: "akshay@example.com",
          role: "User",
          joined: "2024-05-12",
        },
        {
          id: "2",
          name: "Ellie",
          email: "ellie@moviesdom.com",
          role: "Admin",
          joined: "2024-02-19",
        },
        {
          id: "3",
          name: "Rahul",
          email: "rahul@example.com",
          role: "User",
          joined: "2024-06-01",
        }
      ];

      setUsers(dummy);
      localStorage.setItem("users", JSON.stringify(dummy));
    }
  }, []);

  // Change Role
  function changeRole(id: string) {
    const updated = users.map((u) =>
      u.id === id ? { ...u, role: u.role === "Admin" ? "User" : "Admin" } : u
    );

    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  }

  // Delete User
  function deleteUser(id: string) {
    if (!confirm("Delete this user?")) return;

    const updated = users.filter((u) => u.id !== id);

    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-page">
      <h1 className="user-title">User Management</h1>

      {/* Search Bar */}
      <input
        type="text"
        className="user-search"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* User Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.joined}</td>

              <td>
                <span
                  className={
                    u.role === "Admin" ? "role admin" : "role user"
                  }
                >
                  {u.role}
                </span>
              </td>

              <td>
                <button className="role-btn" onClick={() => changeRole(u.id)}>
                  {u.role === "Admin" ? "Set User" : "Set Admin"}
                </button>
              </td>

              <td>
                <button className="delete-btn" onClick={() => deleteUser(u.id)}>
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
