'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <div style={styles.logo}>
        🐄 AI Cattle Vision
      </div>

      {/* Navigation Links */}
      <ul style={styles.navLinks}>
        <li>
          <Link
            href="/"
            style={{
              ...styles.link,
              ...(pathname === "/" ? styles.active : {}),
            }}
          >
            Buy/Sell
          </Link>
        </li>

        <li>
          <Link
            href="/reports"
            style={{
              ...styles.link,
              ...(pathname === "/reports" ? styles.active : {}),
            }}
          >
            Subcidy
          </Link>
        </li>

        <li>
          <Link
            href="/settings"
            style={{
              ...styles.link,
              ...(pathname === "/settings" ? styles.active : {}),
            }}
          >
            MY Al Chat
          </Link>
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    height: "70px",
    width: "100%",
    backgroundColor: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  logo: {
    color: "#38bdf8",
    fontSize: "20px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "30px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#e5e7eb",
    textDecoration: "none",
    fontSize: "16px",
    padding: "6px 10px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  },
  active: {
    backgroundColor: "#2563eb",
    color: "white",
  },
};
