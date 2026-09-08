# Text Diff Checker

**Live demo:** https://babug01.github.io/text-diff-checker/

Paste two blocks of text and see a line-level diff between them — a unified view (`+`/`-` lines,
green/red) or a side-by-side view, plus a summary count of lines added, removed, and unchanged. The
diff itself is a plain LCS (longest common subsequence) algorithm written by hand, no diff library.
Runs entirely in the browser.

## Features

- **Line-level LCS diff** — builds the LCS table over the two line arrays, then backtracks to emit
  an equal/added/removed line stream, computed directly in JS with no dependency
- **Unified view** — added lines in green with `+`, removed lines in red with `-`, unchanged lines
  plain
- **Side-by-side view** — original on the left, changed on the right, with matching changed lines
  paired onto the same row instead of shown as an unrelated remove-then-add
- **Summary counts** of lines added / removed / unchanged
- Toggle between the two views without re-running the diff

## Tech stack

[React](https://react.dev/) + [Vite](https://vitejs.dev/) — the diff algorithm is hand-written
JavaScript (LCS table + backtrack), deliberately dependency-free.

## Running locally

```bash
git clone https://github.com/Babug01/text-diff-checker.git
cd text-diff-checker
npm install
npm run dev
```

## License

MIT — see [LICENSE](LICENSE).
