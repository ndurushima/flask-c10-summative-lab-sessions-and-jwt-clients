import React from "react";
import { Button } from "../styles";

function NavBar({ setUser }) {
  async function handleLogout() {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    console.log("Logout Authorization header:", headers.Authorization);

    try {
      const res = await fetch("/auth/logout", { method: "POST", headers });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.warn("Logout failed:", res.status, data);
      }
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
      <Button onClick={handleLogout}>Log out</Button>
    </nav>
  );
}



// const Wrapper = styled.header`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 8px;
// `;

// const Logo = styled.h1`
//   font-family: "Permanent Marker", cursive;
//   font-size: 3rem;
//   color: deeppink;
//   margin: 0;
//   line-height: 1;

//   a {
//     color: inherit;
//     text-decoration: none;
//   }
// `;

// const Nav = styled.nav`
//   display: flex;
//   gap: 4px;
//   position: absolute;
//   right: 8px;
// `;

export default NavBar;
