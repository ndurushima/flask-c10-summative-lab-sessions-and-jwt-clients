import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Login from "../pages/Login";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  const onLogin = (access_token, userObj) => {
    localStorage.setItem("token", access_token);
    setUser(userObj);
  };

  return user ? (
    <>
      <NavBar setUser={setUser} />
      <main>
        <p>You are logged in!</p>
      </main>
    </>
  ) : (
    <Login onLogin={onLogin} />
  );
}

export default App;
