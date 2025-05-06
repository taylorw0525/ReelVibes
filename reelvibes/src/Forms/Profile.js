import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Profile.css";

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Track saving state

  // Initialize form with user.user
  const [formData, setFormData] = useState({
    first: user?.user?.username?.split(" ")[0] || "",
    last: user?.user?.username?.split(" ").slice(1).join(" ") || "",
    email: user?.user?.email || "",
    password: "",
  });

  // Sync form if user loads later
  useEffect(() => {
    if (user?.user) {
      setFormData({
        first: user.user.username?.split(" ")[0] || "",
        last: user.user.username?.split(" ").slice(1).join(" ") || "",
        email: user.user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${user.user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: `${formData.first} ${formData.last}`.trim(),
            email: formData.email,
            password: formData.password, // send only if user entered
          }),
        }
      );

      const updatedUser = await res.json();

      if (res.ok) {
        console.log("Profile updated:", updatedUser);

        // If user provided password, then auto-login. Else skip.
        if (formData.password) {
          const loginRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, password: formData.password }),
          });

          const loginData = await loginRes.json();

          if (loginRes.ok) {
            localStorage.setItem("user", JSON.stringify(loginData));
            login(loginData);
          } else {
            alert(loginData.message || "Re-login failed.");
          }
        } else {
          // If no password change, just update username/email locally
          const newUser = { ...user, user: { ...user.user, username: `${formData.first} ${formData.last}`, email: formData.email } };
          localStorage.setItem("user", JSON.stringify(newUser));
          login(newUser);
        }

        setEditing(false);
        alert("Profile updated!");
        navigate("/");
      } else {
        alert(updatedUser.message || "Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };


  const handleEdit = () => {
    setEditing(true); // Enable editing mode
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

<div className="profile-row">
  <label className="profile-label" htmlFor="first">First Name</label>
  <input
    id="first"
    type="text"
    name="first"
    className="profile-input"
    value={formData.first}
    onChange={handleChange}
    disabled={!editing}
    required
  />
</div>

<div className="profile-row">
  <label className="profile-label" htmlFor="last">Last Name</label>
  <input
    id="last"
    type="text"
    name="last"
    className="profile-input"
    value={formData.last}
    onChange={handleChange}
    disabled={!editing}
  />
</div>

<div className="profile-row">
  <label className="profile-label" htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    name="email"
    className="profile-input"
    value={formData.email}
    onChange={handleChange}
    disabled={!editing}
    required
  />
</div>

<div className="profile-row">
  <label className="profile-label" htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    name="password"
    className="profile-input"
    placeholder="New Password (leave blank to keep current)"
    value={formData.password}
    onChange={handleChange}
    disabled={!editing}
  />
</div>



          {editing ? (
            <>
              <button
                type="submit"
                className="profile-button"
                disabled={isSaving} // Disable button while saving
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="profile-button cancel-button"
                onClick={() => setEditing(false)} // Cancel editing
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="profile-button"
              onClick={handleEdit} // Only enable editing when clicked
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
