import { Link, useLocation } from "react-router-dom";
import { PageTransition } from "../PageTransition";

const NAV_LINKS = [
  { path: "/",           label: "HOME"        },
  { path: "/visualizer", label: "VISUALIZER"  },
  { path: "/graph",      label: "GRAPH"       },
  { path: "/quiz",       label: "QUIZ"        },
  { path: "/cheatsheet", label: "CHEAT SHEET" },
];

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  const location = useLocation();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050a12",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Courier New', monospace",
      color: "#e0e8f0",
    }}>
      {/* Navbar */}
      <nav style={{
        borderBottom: "1px solid #0d2035",
        background: "linear-gradient(180deg, #080f1a 0%, #050a12 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#00f5ff",
            boxShadow: "0 0 10px #00f5ff",
          }} />
          <span style={{
            fontSize: 13, letterSpacing: "0.3em",
            color: "#4a7fa5", textTransform: "uppercase",
          }}>
            Algorithm Lab
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: "flex" }}>
          {NAV_LINKS.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                style={{
                  padding: "20px 16px",
                  textDecoration: "none",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color: isActive ? "#00f5ff" : "#2a5a7a",
                  borderBottom: isActive ? "2px solid #00f5ff" : "2px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Badge */}
        <div style={{
          fontSize: 9, padding: "4px 10px",
          border: "1px solid #0d2035",
          borderRadius: 20, color: "#1e3a5f",
          letterSpacing: "0.2em",
        }}>
          v2.0.0
        </div>
      </nav>

      {/* Page content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
  <PageTransition>
    {children}
  </PageTransition>
</main>
    </div>
  );
}