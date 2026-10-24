import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [authenticated, setauthenticated] = useState(null);

  useEffect(() => {
    async function getAuthenticate() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/profile", {
          credentials: "include",
        });

        setauthenticated(response.ok);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setauthenticated(false);
      }
    }
    getAuthenticate();
  }, []);

  if (authenticated === null) {
    return <p>Checking authentication...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
