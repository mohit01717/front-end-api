import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login request failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" flex flex-col  gap-4  justify-center   w-[50%]  rounded-xl   bg-white p-4  ">
      <div className=" flex flex-col gap-2   ">
        <div className=" font-semibold">Email or Username</div>
        <input
          type="text"
          name="email"
          id=""
          className="border px-2 py-2 "
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />

        <div className="font-semibold">Password</div>
        <input
          type="password"
          name="password"
          id=""
          className="border px-4 py-2"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <button
        className="border-blue-400 bg-blue-400  py-2 hover:bg-blue-500 rounded "
        disabled={loading}
        onClick={(e) => handleSubmit(e)}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Login;
