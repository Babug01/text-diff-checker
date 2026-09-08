// Pure line-level LCS diff — no React, no external diff library — so it can
// be smoke-tested directly with `node`.

// Builds the LCS table over the two line arrays, then backtracks from (0,0)
// to emit an equal/added/removed line stream in original order.
export function diffLines(originalText, changedText) {
  const a = (originalText ?? "").split("\n");
  const b = (changedText ?? "").split("\n");
  const n = a.length;
  const m = b.length;

  // dp[i][j] = length of the LCS of a[i..] and b[j..]
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      result.push({ type: "equal", line: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "removed", line: a[i] });
      i++;
    } else {
      result.push({ type: "added", line: b[j] });
      j++;
    }
  }
  while (i < n) {
    result.push({ type: "removed", line: a[i] });
    i++;
  }
  while (j < m) {
    result.push({ type: "added", line: b[j] });
    j++;
  }
  return result;
}

export function summarize(diffResult) {
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  for (const d of diffResult) {
    if (d.type === "added") added++;
    else if (d.type === "removed") removed++;
    else unchanged++;
  }
  return { added, removed, unchanged };
}

// Pairs up consecutive removed/added runs into side-by-side rows so a
// changed line shows up on the same row instead of as an unrelated
// remove-then-add pair. Unequal-length runs pad the shorter side with null.
export function toSideBySide(diffResult) {
  const rows = [];
  let i = 0;
  while (i < diffResult.length) {
    const d = diffResult[i];
    if (d.type === "equal") {
      rows.push({ left: d.line, right: d.line, type: "equal" });
      i++;
      continue;
    }
    const removed = [];
    while (i < diffResult.length && diffResult[i].type === "removed") {
      removed.push(diffResult[i].line);
      i++;
    }
    const added = [];
    while (i < diffResult.length && diffResult[i].type === "added") {
      added.push(diffResult[i].line);
      i++;
    }
    const max = Math.max(removed.length, added.length);
    for (let k = 0; k < max; k++) {
      const hasLeft = k < removed.length;
      const hasRight = k < added.length;
      rows.push({
        left: hasLeft ? removed[k] : null,
        right: hasRight ? added[k] : null,
        type: hasLeft && hasRight ? "changed" : hasLeft ? "removed" : "added",
      });
    }
  }
  return rows;
}
