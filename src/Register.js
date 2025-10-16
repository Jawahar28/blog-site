import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://127.0.0.1:8000/api/auth/registration/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, email, password1, password2 }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Registration successful! Please log in.");
                navigate("/login");
            } else {
                alert("Error: " + JSON.stringify(data));
            }
        } catch (err) {
            console.error("Error registering:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Register</button>
            </form>
        </div>
    );
}

export default Register;
