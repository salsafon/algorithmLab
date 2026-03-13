interface Props {
  algoColor: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ algoColor, activeTab, onTabChange }: Props) {
  return (
    <div style={{
      borderBottom: "1px solid #0d2035",
      background: "linear-gradient(180deg, #080f1a 0%, #050a12 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0" }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: algoColor,
          boxShadow: `0 0 10px ${algoColor}`,
          transition: "background 0.3s, box-shadow 0.3s",
        }} />
        <span style={{
          fontSize: 13, letterSpacing: "0.3em",
          color: "#4a7fa5", textTransform: "uppercase",
        }}>
          Algorithm Lab
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex" }}>
        {["visualizer", "complexity"].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              padding: "18px 20px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab ? `2px solid ${algoColor}` : "2px solid transparent",
              color: activeTab === tab ? algoColor : "#2a5a7a",
              fontSize: 10, letterSpacing: "0.3em",
              cursor: "pointer", fontFamily: "inherit",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Version */}
      <span style={{ fontSize: 11, color: "#1e3a5f", letterSpacing: "0.2em" }}>
        v1.0.0
      </span>
    </div>
  );
}