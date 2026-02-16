import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const PLAYERS = {
  X: "X",
  O: "O",
};

const WIN_LINES = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Compute winner for a given board.
 * @param {Array<"X"|"O"|null>} squares
 * @returns {{winner: "X"|"O"|null, line: number[]|null}}
 */
function calculateWinner(squares) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

/**
 * Returns true if all squares are filled and there's no winner.
 * @param {Array<"X"|"O"|null>} squares
 * @param {"X"|"O"|null} winner
 * @returns {boolean}
 */
function isDraw(squares, winner) {
  return !winner && squares.every((sq) => sq !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** Theme is kept (and defaulted to light) to match template behavior and style guide. */
  const [theme] = useState("light");

  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => isDraw(squares, winner), [squares, winner]);

  const currentPlayer = xIsNext ? PLAYERS.X : PLAYERS.O;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const statusText = useMemo(() => {
    if (winner) return `Player ${winner} wins!`;
    if (draw) return "Draw game.";
    return `Player ${currentPlayer}'s turn`;
  }, [winner, draw, currentPlayer]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /** Ignore taps if game already ended or square is already filled. */
    if (winner || draw || squares[index]) return;

    setSquares((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="App">
      <main className="page">
        <section className="card" aria-label="Tic Tac Toe">
          <header className="header">
            <div className="badge" aria-hidden="true">
              Tic Tac Toe
            </div>
            <h1 className="title">Play a classic 3×3 game</h1>
            <p className="subtitle">Two players. One device. Take turns and win with three in a row.</p>
          </header>

          <div className="statusRow" role="status" aria-live="polite">
            <span className={`statusPill ${winner ? "statusPill--win" : draw ? "statusPill--draw" : ""}`}>
              {statusText}
            </span>
          </div>

          <div className="boardWrap">
            <div className="board" role="grid" aria-label="Tic Tac Toe board">
              {squares.map((value, idx) => {
                const isWinningSquare = line ? line.includes(idx) : false;
                const isDisabled = Boolean(winner || draw || value);

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`square ${value ? "square--filled" : ""} ${
                      value === "X" ? "square--x" : value === "O" ? "square--o" : ""
                    } ${isWinningSquare ? "square--win" : ""}`}
                    onClick={() => handleSquareClick(idx)}
                    disabled={isDisabled}
                    role="gridcell"
                    aria-label={`Square ${idx + 1}${value ? `, ${value}` : ""}`}
                  >
                    <span className="squareValue" aria-hidden="true">
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="footer">
            <button type="button" className="btnPrimary" onClick={restartGame}>
              Restart
            </button>

            <div className="hint" aria-hidden="true">
              Tip: X always starts.
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
