// /Forms/Profile.js

import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../App.css";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first: user?.user?.username?.split(" ")[0] || "",
    last: user?.user?.username?.split(" ")[1] || "",
    email: user?.user?.email || "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: `${formData.first} ${formData.last}`,
          email: formData.email,
          password: formData.password,
        }),
      });

      const updatedUser = await res.json();

      if (res.ok) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditing(false);
      } else {
        alert(updatedUser.message || "Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="App">
      <div className="background-container">
        <div className="background-overlay"></div>
        <div className="background-image"></div>
      </div>

      <div className="content-layer">
        <form className="profile-form" onSubmit={handleSave}>
          <h2 className="profile-title">User Profile</h2>

          <input
            type="text"
            name="first"
            className="profile-input"
            value={formData.first}
            onChange={handleChange}
            disabled={!editing}
          />
          <input
            type="text"
            name="last"
            className="profile-input"
            value={formData.last}
            onChange={handleChange}
            disabled={!editing}
          />
          <input
            type="email"
            name="email"
            className="profile-input"
            value={formData.email}
            onChange={handleChange}
            disabled={!editing}
          />
          <input
            type="password"
            name="password"
            className="profile-input"
            placeholder="New Password (leave blank to keep current)"
            value={formData.password}
            onChange={handleChange}
            disabled={!editing}
          />

          {editing ? (
            <button type="submit" className="profile-button">Save Changes</button>
          ) : (
            <button
              type="button"
              className="profile-button"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
