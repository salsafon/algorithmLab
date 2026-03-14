import { useState } from "react";

interface Props {
  isOpen: boolean;
  algoColor: string;
  onClose: () => void;
  onApply: (arr: number[]) => void;
}

export function CustomInputModal({ isOpen, algoColor, onClose, onApply }: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleApply = () => {
    const values = input
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "");

    if (values.length < 2) {
      setError("Please enter at least 2 numbers.");
      return;
    }

    if (values.length > 80) {
      setError("Maximum 80 values allowed.");
      return;
    }

    const nums = values.map(Number);

    if (nums.some(isNaN)) {
      setError("Only numbers are allowed. Separate them with commas.");
      return;
    }

    if (nums.some((n) => n < 1 || n > 999)) {
      setError("Values must be between 1 and 999.");
      return;
    }

    setError("");
    onApply(nums);
    onClose();
  };

  const handleClose = () => {
    setError("");
    setInput("");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0,
          background: "#000000aa",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#040810",
        border: `1px solid ${algoColor}44`,
        borderRadius: 8,
        padding: 28,
        width: 480,
        zIndex: 101,
        fontFamily: "'Courier New', monospace",
        boxShadow: `0 0 40px ${algoColor}22`,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: algoColor }} />
            <span style={{ fontSize: 11, color: algoColor, letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Custom Input
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "transparent", border: "none",
              color: "#2a5a7a", fontSize: 16,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >✕</button>
        </div>

        {/* Description */}
        <div style={{ fontSize: 10, color: "#2a5a7a", marginBottom: 16, lineHeight: 1.6 }}>
          Enter numbers separated by commas. Min 2, max 80 values. Range 1–999.
        </div>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          placeholder="e.g.  5, 3, 8, 1, 9, 2, 7, 4, 6"
          rows={4}
          style={{
            width: "100%",
            background: "#080f1a",
            border: `1px solid ${error ? "#ff4444" : "#0d2035"}`,
            borderRadius: 4,
            color: "#e0e8f0",
            fontSize: 12,
            fontFamily: "'Courier New', monospace",
            padding: "10px 12px",
            resize: "none",
            outline: "none",
            lineHeight: 1.6,
            transition: "border 0.2s",
          }}
        />

        {/* Error */}
        {error && (
          <div style={{ fontSize: 10, color: "#ff4444", marginTop: 6, letterSpacing: "0.1em" }}>
            ⚠ {error}
          </div>
        )}

        {/* Preview */}
        {input && !error && (
          <div style={{ marginTop: 10, fontSize: 10, color: "#2a5a7a" }}>
            <span style={{ color: "#4a7fa5" }}>PREVIEW — </span>
            {input.split(",").filter(v => v.trim() !== "").length} values
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1, padding: "9px",
              background: "transparent",
              border: "1px solid #0d2035",
              color: "#2a5a7a", borderRadius: 4,
              fontSize: 10, letterSpacing: "0.2em",
              cursor: "pointer", fontFamily: "inherit",
              textTransform: "uppercase",
            }}
          >
            CANCEL
          </button>
          <button
            onClick={handleApply}
            style={{
              flex: 2, padding: "9px",
              background: `linear-gradient(135deg, ${algoColor}22, ${algoColor}11)`,
              border: `1px solid ${algoColor}`,
              color: algoColor, borderRadius: 4,
              fontSize: 10, letterSpacing: "0.3em",
              cursor: "pointer", fontFamily: "inherit",
              textTransform: "uppercase",
              boxShadow: `0 0 12px ${algoColor}22`,
            }}
          >
            ✓ APPLY
          </button>
        </div>
      </div>
    </>
  );
}