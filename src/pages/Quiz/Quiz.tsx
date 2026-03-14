import { useState, useEffect, useRef } from "react";
import { Layout } from "../../components";
import { ALGORITHMS } from "../../algorithms";
import { ALGORITHM_KEYS } from "../../constants";

const ALGO_LIST = ALGORITHM_KEYS.map((k) => ALGORITHMS[k]);

type QuizState = "idle" | "watching" | "guessing" | "correct" | "wrong";

function generateArray(size: number) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 20);
}

interface FrameSnapshot {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot: number[];
}

export function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [score, setScore] = useState({ correct: 0, wrong: 0, streak: 0 });
  const [currentAlgo, setCurrentAlgo] = useState<string | null>(null);
  const [frames, setFrames] = useState<FrameSnapshot[]>([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [guess, setGuess] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const buildFrames = async (algoKey: string) => {
    const arr = generateArray(28);
    const algo = ALGORITHMS[algoKey];
    const controller = new AbortController();
    const collected: FrameSnapshot[] = [];

    for await (const f of algo.run(arr, controller.signal)) {
      collected.push({
        array: f.array ?? [],
        comparing: f.comparing ?? [],
        swapping: f.swapping ?? [],
        sorted: f.sorted ?? [],
        pivot: f.pivot ?? [],
      });
      if (collected.length > 600) break;
    }
    return collected;
  };

  const startRound = async () => {
    stopAnimation();
    setQuizState("watching");
    setGuess(null);
    setFrameIdx(0);
    setFrames([]);

    // Pick random algo
    const algoKey = ALGORITHM_KEYS[Math.floor(Math.random() * ALGORITHM_KEYS.length)];
    setCurrentAlgo(algoKey);

    // Build wrong choices
    const others = ALGORITHM_KEYS.filter(k => k !== algoKey);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const allChoices = [...shuffled, algoKey].sort(() => Math.random() - 0.5);
    setChoices(allChoices);

    const collected = await buildFrames(algoKey);
    setFrames(collected);
    setRound(r => r + 1);
  };

  // Animate frames
  useEffect(() => {
    if (frames.length === 0 || quizState !== "watching") return;
    stopAnimation();
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx++;
      if (idx >= frames.length) {
        stopAnimation();
        setQuizState("guessing");
        return;
      }
      setFrameIdx(idx);
    }, 60);
    return stopAnimation;
  }, [frames, quizState]);

  const handleGuess = (key: string) => {
    if (quizState !== "guessing" && quizState !== "watching") return;
    stopAnimation();
    setGuess(key);
    if (key === currentAlgo) {
      setQuizState("correct");
      setScore(s => ({ correct: s.correct + 1, wrong: s.wrong, streak: s.streak + 1 }));
    } else {
      setQuizState("wrong");
      setScore(s => ({ correct: s.correct, wrong: s.wrong + 1, streak: 0 }));
    }
  };

  const currentFrame = frames[frameIdx];
  const maxVal = currentFrame ? Math.max(...currentFrame.array) : 100;

  const getBarColor = (i: number) => {
    if (!currentFrame) return "#1e3a5f";
    if (currentFrame.sorted?.includes(i)) return "#00f5ff";
    if (currentFrame.swapping?.includes(i)) return "#ff4444";
    if (currentFrame.pivot?.includes(i)) return "#ffd700";
    if (currentFrame.comparing?.includes(i)) return "#ffffff";
    return "#1e3a5f";
  };

  return (
    <Layout>
      <div style={{ padding: "48px", maxWidth: 900, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.4em", marginBottom: 12 }}>
            QUIZ MODE
          </div>
          <h1 style={{
            fontSize: 32, color: "#e0e8f0",
            fontFamily: "'Courier New', monospace",
            fontWeight: "bold", marginBottom: 8,
          }}>
            Guess the Algorithm
          </h1>
          <p style={{ fontSize: 12, color: "#2a5a7a", lineHeight: 1.7 }}>
            Watch the animation and identify which sorting algorithm is running.
          </p>
        </div>

        {/* Score bar */}
        <div style={{
          display: "flex", gap: 12, marginBottom: 32,
        }}>
          {[
            { label: "CORRECT", value: score.correct, color: "#3a9a3a" },
            { label: "WRONG",   value: score.wrong,   color: "#ff4444" },
            { label: "STREAK",  value: score.streak,  color: "#ffd700" },
            { label: "ROUND",   value: round,          color: "#00f5ff" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              flex: 1, padding: "14px",
              background: "#040810",
              border: `1px solid ${color}22`,
              borderRadius: 8, textAlign: "center",
            }}>
              <div style={{ fontSize: 24, color, fontWeight: "bold", marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 8, color: "#2a5a7a", letterSpacing: "0.25em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Idle state */}
        {quizState === "idle" && (
          <div style={{
            textAlign: "center", padding: "80px 40px",
            background: "#040810", border: "1px solid #0d2035",
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>◎</div>
            <div style={{ fontSize: 14, color: "#4a7fa5", marginBottom: 8 }}>Ready to test your knowledge?</div>
            <div style={{ fontSize: 11, color: "#2a5a7a", marginBottom: 32, lineHeight: 1.7 }}>
              An algorithm will run anonymously.<br />
              Watch carefully and guess which one it is.
            </div>
            <button
              onClick={startRound}
              style={{
                padding: "14px 40px",
                background: "linear-gradient(135deg, #00f5ff22, #00f5ff11)",
                border: "1px solid #00f5ff", color: "#00f5ff",
                borderRadius: 6, fontSize: 11, letterSpacing: "0.3em",
                cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
                boxShadow: "0 0 20px #00f5ff22",
              }}
            >
              ▶ START QUIZ
            </button>
          </div>
        )}

        {/* Visualizer */}
        {(quizState === "watching" || quizState === "guessing" || quizState === "correct" || quizState === "wrong") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Status */}
            <div style={{
              padding: "10px 16px",
              background: "#040810", border: "1px solid #0d2035",
              borderRadius: 6, fontSize: 11,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ color: "#2a5a7a" }}>
                {quizState === "watching" && "👁  Watch carefully..."}
                {quizState === "guessing" && "❓  Animation complete — make your guess!"}
                {quizState === "correct" && <span style={{ color: "#3a9a3a" }}>✓  Correct! That was {ALGORITHMS[currentAlgo!].name}</span>}
                {quizState === "wrong" && <span style={{ color: "#ff4444" }}>✗  Wrong! It was {ALGORITHMS[currentAlgo!].name}</span>}
              </span>
              {quizState === "watching" && (
                <button
                  onClick={() => { stopAnimation(); setQuizState("guessing"); }}
                  style={{
                    padding: "4px 12px", fontSize: 9,
                    background: "transparent", border: "1px solid #0d2035",
                    color: "#2a5a7a", borderRadius: 3, cursor: "pointer",
                    fontFamily: "inherit", letterSpacing: "0.2em",
                  }}
                >
                  SKIP →
                </button>
              )}
            </div>

            {/* Bars */}
            <div style={{
              height: 280,
              display: "flex", alignItems: "flex-end", gap: 3,
              padding: "16px",
              background: "#040810", border: "1px solid #0d2035",
              borderRadius: 8, position: "relative",
            }}>
              {currentFrame?.array.map((val, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${(val / maxVal) * 100}%`,
                  background: getBarColor(i),
                  borderRadius: "2px 2px 0 0",
                  minWidth: 2,
                  transition: "height 0.05s ease, background-color 0.05s ease",
                }} />
              ))}

              {/* Loading overlay */}
              {frames.length === 0 && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#040810",
                }}>
                  <span style={{ fontSize: 10, color: "#2a5a7a", letterSpacing: "0.3em" }}>
                    LOADING...
                  </span>
                </div>
              )}
            </div>

            {/* Choices */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {choices.map((key) => {
                const algo = ALGORITHMS[key];
                const isCorrect = key === currentAlgo;
                const isGuessed = key === guess;
                const revealed = quizState === "correct" || quizState === "wrong";

                let borderColor = "#0d2035";
                let bgColor = "transparent";
                let textColor = "#4a7fa5";

                if (revealed && isCorrect) {
                  borderColor = "#3a9a3a";
                  bgColor = "#0a1f0a";
                  textColor = "#3a9a3a";
                } else if (revealed && isGuessed && !isCorrect) {
                  borderColor = "#ff4444";
                  bgColor = "#1f0a0a";
                  textColor = "#ff4444";
                } else if (!revealed) {
                  borderColor = "#0d2035";
                  bgColor = "transparent";
                  textColor = "#4a7fa5";
                }

                return (
                  <button
                    key={key}
                    onClick={() => handleGuess(key)}
                    disabled={revealed}
                    style={{
                      padding: "16px 20px",
                      background: bgColor,
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      borderRadius: 8, fontSize: 12,
                      cursor: revealed ? "default" : "pointer",
                      fontFamily: "inherit", textAlign: "left",
                      transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                    onMouseEnter={e => { if (!revealed) e.currentTarget.style.borderColor = algo.color; }}
                    onMouseLeave={e => { if (!revealed) e.currentTarget.style.borderColor = "#0d2035"; }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: revealed ? (isCorrect ? "#3a9a3a" : isGuessed ? "#ff4444" : "#1e3a5f") : algo.color,
                      flexShrink: 0,
                    }} />
                    {algo.name}
                    {revealed && isCorrect && <span style={{ marginLeft: "auto", fontSize: 10 }}>✓</span>}
                    {revealed && isGuessed && !isCorrect && <span style={{ marginLeft: "auto", fontSize: 10 }}>✗</span>}
                  </button>
                );
              })}
            </div>

            {/* Next round */}
            {(quizState === "correct" || quizState === "wrong") && (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={startRound}
                  style={{
                    flex: 1, padding: "12px",
                    background: "linear-gradient(135deg, #00f5ff22, #00f5ff11)",
                    border: "1px solid #00f5ff", color: "#00f5ff",
                    borderRadius: 6, fontSize: 11, letterSpacing: "0.3em",
                    cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
                  }}
                >
                  ▶ NEXT ROUND
                </button>
                <button
                  onClick={() => { stopAnimation(); setQuizState("idle"); setScore({ correct: 0, wrong: 0, streak: 0 }); setRound(0); }}
                  style={{
                    padding: "12px 20px",
                    background: "transparent", border: "1px solid #0d2035",
                    color: "#2a5a7a", borderRadius: 6, fontSize: 11,
                    letterSpacing: "0.2em", cursor: "pointer",
                    fontFamily: "inherit", textTransform: "uppercase",
                  }}
                >
                  RESET
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}