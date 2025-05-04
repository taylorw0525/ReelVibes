# 🎶 ReelVibes - Mood Based Playlist Generator

Welcome to ReelVibes — a mood-based playlist web app where users can select their mood and get matching playlists generated for them!  
This project uses **MERN stack (MongoDB, Express, React, Node.js)** and supports user authentication.

---

## 🚀 Quick Start for Developers

### 1. Clone the Repo
```bas
git clone https://github.com/taylorw0525/ReelVibes.git
cd ReelVibes
cd reelvibes
```

### 2. Setup & Run the Backend
Navigate to the backend folder:

```cd backend```
Install backend dependencies:

```npm install```
### 3. Run the backend server (make sure MongoDB is running locally):

```node server```
The backend server runs on: http://localhost:5000

### 4. Setup & Run the Frontend (React App)
Open new terminal 
```
cd reelvibes
```
### 5 Install frontend dependencies and run front end:

```
npm install
npm start
```

Application should be starting now.. 
Important tips is you need to start backend first (```node server```) from backend folder and then front end```npm start``` form reelvibes folder

## 💡 Useful Notes
- After signup, users are auto-logged in and session persists using localStorage.
- Navbar updates live based on login status.
- Mood selection is only accessible after login.
- User info (username, email, id) is globally available via AuthContext.

## 🛠️ Dev Tips
- Backend errors will log in Terminal (node server console).
- Frontend errors will log in Browser console.