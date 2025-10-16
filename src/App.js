import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

/* -------------------- PostList -------------------- */
function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://basic-blogs.onrender.com", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Blog Posts</h2>
        <Link to="/create" className="btn btn-success">+ Create Post</Link>
      </div>
      <div className="row">
        {posts.map((post) => (
          <div className="col-md-4 mb-3" key={post.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5>{post.title}</h5>
                <p>{post.content.substring(0, 100)}...</p>
                <Link to={`/posts/${post.id}`} className="btn btn-primary">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- PostDetail -------------------- */
function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`https://basic-blogs.onrender.com/${id}/`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error("Error fetching post:", err));
  }, [id]);

  if (!post) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>{post.title}</h2>
      <p className="mt-3">{post.content}</p>
      <Link to="/" className="btn btn-secondary mt-3">Back to Posts</Link>
    </div>
  );
}

/* -------------------- CreatePost -------------------- */
function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = { title, content }; // no hardcoded author

    fetch("https://basic-blogs.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
      credentials: "inlcude",
      body: JSON.stringify(newPost),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or bad request");
        return res.json();
      })
      .then(() => navigate("/"))
      .catch((err) => console.error("Error creating post:", err));
  };

  return (
    <div className="container mt-5">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success">Submit</button>
        <Link to="/" className="btn btn-secondary ms-2">Cancel</Link>
      </form>
    </div>
  );
}

/* -------------------- PrivateRoute -------------------- */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
}

/* -------------------- App -------------------- */
function App() {
  return (
    <Router>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex justify-content-between">
          <Link to="/" className="navbar-brand">My Blog</Link>
          <div>
            {localStorage.getItem("access_token") ? (
              <button
                className="btn btn-outline-light"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  window.location.reload();
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
                <Link to="/register" className="btn btn-outline-light">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
