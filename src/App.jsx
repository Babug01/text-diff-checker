import { Fragment, useState } from "react";
import Header from "./components/Header";
import { diffLines, summarize, toSideBySide } from "./lib/diff";

const REPO_URL = "https://github.com/Babug01/text-diff-checker";

export default function TextDiffChecker() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");
  const [result, setResult] = useState(null);
  const [view, setView] = useState("unified");

  function compare() {
    const diff = diffLines(original, changed);
    setResult({ diff, summary: summarize(diff), sideBySide: toSideBySide(diff) });
  }

  function clearAll() {
    setOriginal("");
    setChanged("");
    setResult(null);
  }

  return (
    <div style={styles.root}>
      <Header repoUrl={REPO_URL} />
      <div style={styles.content}>
        <h1 style={styles.title}>Text Diff Checker</h1>
        <p style={styles.subtitle}>
          Line-level diff computed with a dependency-free LCS algorithm, entirely in the browser.
          Nothing you paste ever leaves your machine.
        </p>

        <div style={styles.inputGrid}>
          <div style={styles.field}>
            <span style={styles.label}>Original</span>
            <textarea style={styles.textarea} value={original} onChange={(e) => setOriginal(e.target.value)} spellCheck={false} />
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Changed</span>
            <textarea style={styles.textarea} value={changed} onChange={(e) => setChanged(e.target.value)} spellCheck={false} />
          </div>
        </div>

        <div style={styles.row}>
          <button style={styles.btn("primary")} onClick={compare}>Compare</button>
          <button style={styles.btn("secondary")} onClick={clearAll}>Clear</button>
        </div>

        {result && (
          <>
            <div style={styles.summaryRow}>
              <span style={{ ...styles.badge, color: "#3fb950", background: "rgba(63,185,80,0.12)" }}>+{result.summary.added} added</span>
              <span style={{ ...styles.badge, color: "#e05c5c", background: "rgba(224,92,92,0.12)" }}>-{result.summary.removed} removed</span>
              <span style={{ ...styles.badge, color: "#8a8a8a", background: "rgba(138,138,138,0.12)" }}>{result.summary.unchanged} unchanged</span>

              <div style={styles.toggleGroup}>
                <button style={styles.toggleBtn(view === "unified")} onClick={() => setView("unified")}>Unified</button>
                <button style={styles.toggleBtn(view === "side")} onClick={() => setView("side")}>Side-by-side</button>
              </div>
            </div>

            {view === "unified" ? (
              <div style={styles.diffBox}>
                {result.diff.map((d, i) => (
                  <div key={i} style={styles.lineRow(d.type)}>
                    <span style={styles.gutter}>{d.type === "added" ? "+" : d.type === "removed" ? "-" : " "}</span>
                    <span style={styles.lineText}>{d.line === "" ? " " : d.line}</span>
                  </div>
                ))}
                {result.diff.length === 0 && <div style={styles.emptyMsg}>Both sides are empty.</div>}
              </div>
            ) : (
              <div style={styles.sideBox}>
                {result.sideBySide.map((r, i) => (
                  <Fragment key={i}>
                    <div style={styles.sideCell(r.type, "left")}>{r.left === null ? "" : r.left === "" ? " " : r.left}</div>
                    <div style={styles.sideCell(r.type, "right")}>{r.right === null ? "" : r.right === "" ? " " : r.right}</div>
                  </Fragment>
                ))}
                {result.sideBySide.length === 0 && (
                  <div style={{ ...styles.emptyMsg, gridColumn: "1 / -1" }}>Both sides are empty.</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100dvh", display: "flex", flexDirection: "column" },
  content: {
    fontFamily: "system-ui, sans-serif", padding: "24px 32px", maxWidth: 1100, margin: "0 auto",
    color: "var(--text, #1a1a1a)", width: "100%", boxSizing: "border-box", background: "var(--bg-subtle, #f0efed)", flex: 1,
  },
  title: { fontSize: 22, fontWeight: 700, margin: 0 },
  subtitle: { fontSize: 13, opacity: 0.6, margin: "4px 0 20px" },
  inputGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 4 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, opacity: 0.65 },
  textarea: {
    width: "100%", minHeight: 180, padding: 12, borderRadius: 8, border: "1px solid var(--border, #e5e7eb)",
    background: "var(--input-bg, #f9fafb)", color: "var(--text, #1a1a1a)", fontSize: 12, boxSizing: "border-box",
    fontFamily: "'SFMono-Regular', Consolas, monospace", resize: "vertical",
  },
  row: { display: "flex", gap: 10, marginTop: 16, marginBottom: 20 },
  btn: (kind) => ({
    padding: "9px 18px", borderRadius: 6, border: kind === "primary" ? "none" : "1px solid var(--border, #e5e7eb)",
    background: kind === "primary" ? "var(--accent, #4f46e5)" : "transparent",
    color: kind === "primary" ? "#fff" : "var(--text, #1a1a1a)", cursor: "pointer", fontSize: 13, fontWeight: 600,
  }),
  summaryRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  toggleGroup: { marginLeft: "auto", display: "flex", border: "1px solid var(--border, #e5e7eb)", borderRadius: 6, overflow: "hidden" },
  toggleBtn: (active) => ({
    padding: "7px 14px", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
    background: active ? "var(--accent, #4f46e5)" : "transparent",
    color: active ? "#fff" : "var(--text, #1a1a1a)",
  }),
  diffBox: {
    border: "1px solid var(--border, #e5e7eb)", borderRadius: 8, background: "var(--bg, #fff)",
    fontFamily: "'SFMono-Regular', Consolas, monospace", fontSize: 12.5, overflow: "auto", maxHeight: 480,
  },
  lineRow: (type) => ({
    display: "flex", padding: "2px 10px",
    background: type === "added" ? "rgba(63,185,80,0.12)" : type === "removed" ? "rgba(224,92,92,0.12)" : "transparent",
    color: type === "added" ? "#3fb950" : type === "removed" ? "#e05c5c" : "var(--text, #1a1a1a)",
    whiteSpace: "pre-wrap", wordBreak: "break-all",
  }),
  gutter: { width: 18, flexShrink: 0, opacity: 0.7, userSelect: "none" },
  lineText: { flex: 1 },
  sideBox: {
    display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid var(--border, #e5e7eb)", borderRadius: 8,
    background: "var(--bg, #fff)", fontFamily: "'SFMono-Regular', Consolas, monospace", fontSize: 12.5,
    overflow: "auto", maxHeight: 480,
  },
  sideCell: (type, side) => {
    const isRemoval = type === "removed" || type === "changed";
    const isAddition = type === "added" || type === "changed";
    const active = side === "left" ? isRemoval : isAddition;
    return {
      padding: "2px 10px", whiteSpace: "pre-wrap", wordBreak: "break-all",
      borderLeft: side === "right" ? "1px solid var(--border, #e5e7eb)" : "none",
      background: active ? (side === "left" ? "rgba(224,92,92,0.12)" : "rgba(63,185,80,0.12)") : "transparent",
      color: active ? (side === "left" ? "#e05c5c" : "#3fb950") : "var(--text, #1a1a1a)",
    };
  },
  emptyMsg: { padding: 16, fontSize: 13, opacity: 0.6 },
};
