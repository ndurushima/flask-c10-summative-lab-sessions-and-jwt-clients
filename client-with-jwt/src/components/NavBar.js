import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../styles";

function NavBar({ setUser }) {
  async function handleLogout() {
    const token = localStorage.getItem("token");
    try {
      await fetch("/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end", padding: 16, gap: 8 }}>
      <Button onClick={handleLogout}>Log out</Button>
    </nav>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const Logo = styled.h1`
  font-family: "Permanent Marker", cursive;
  font-size: 3rem;
  color: deeppink;
  margin: 0;
  line-height: 1;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 4px;
  position: absolute;
  right: 8px;
`;

export default NavBar;
