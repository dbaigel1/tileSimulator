import { useState, useEffect } from "react";

const letterFrequencies: Record<string, number> = {
  A: 8.17,
  B: 1.49,
  C: 2.78,
  D: 4.25,
  E: 12.7,
  F: 2.23,
  G: 2.02,
  H: 6.09,
  I: 6.97,
  J: 0.15,
  K: 0.77,
  L: 4.03,
  M: 2.41,
  N: 6.75,
  O: 7.51,
  P: 1.93,
  Q: 0.1,
  R: 5.99,
  S: 6.33,
  T: 9.06,
  U: 2.76,
  V: 0.98,
  W: 2.36,
  X: 0.15,
  Y: 1.97,
  Z: 0.07,
  "*": 5,
};

const letterPool: string[] = Object.entries(letterFrequencies).flatMap(
  ([letter, freq]) => Array(Math.round(freq * 10)).fill(letter)
);

const getRandomLetter = (): string =>
  letterPool[Math.floor(Math.random() * letterPool.length)];

const themes = [
  "love",
  "beauty",
  "nature",
  "sacrifice",
  "a distant memory",
  "facing fear",
  "a moment of joy",
  "lost and found",
  "sounds of the night",
  "a dream you had",
  "a secret door",
  "time",
  "a fleeting moment",
  "the meaning of home",
  "a missed opportunity",
  "winter’s first snow",
  "a stormy night",
  "changing leaves",
  "new beginnings",
  "forgotten objects",
  "talking to a cat",
  "nostalgia",
];

interface Tile {
  letter: string;
  removed: boolean;
}

export default function TileGame() {
  const [players, setPlayers] = useState<number>(0);
  const [rows, setRows] = useState<Tile[][]>([]);
  const [playerNames, setPlayerNames] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("playerNames") || "[]")
  );
  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("playerNames", JSON.stringify(playerNames));
  }, [playerNames]);

  const startGame = (): void => {
    if (players < 1) return;
    setRows(
      Array.from({ length: players }, () =>
        Array.from(
          { length: 15 },
          (): Tile => ({ letter: getRandomLetter(), removed: false })
        )
      )
    );
    setPlayerNames(
      Array.from({ length: players }, (_, i) => playerNames[i] || "")
    );
    setTheme(themes[Math.floor(Math.random() * themes.length)]);
  };

  const toggleTile = (playerIdx: number, tileIdx: number): void => {
    setRows((prevRows) =>
      prevRows.map((row, rIdx) =>
        rIdx === playerIdx
          ? row.map((tile, tIdx) =>
              tIdx === tileIdx ? { ...tile, removed: !tile.removed } : tile
            )
          : row
      )
    );
  };

  const regenerateTiles = (): void => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.map((tile) =>
          tile.removed ? { letter: getRandomLetter(), removed: false } : tile
        )
      )
    );
  };

  const updatePlayerName = (index: number, name: string) => {
    setPlayerNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[index] = name;
      return newNames;
    });
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Tile Game</h1>
      <input
        type="number"
        min="1"
        className="border p-2 rounded mb-2"
        value={players || ""}
        onChange={(e) => setPlayers(parseInt(e.target.value) || 0)}
        placeholder="Enter number of players"
      />
      <button
        onClick={startGame}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start
      </button>
      {theme && (
        <div
          className="mt-4 p-4 bg-yellow-100 border border-yellow-500 rounded-md shadow-md text-lg italic"
          style={{
            background:
              "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
          }}
        >
          Theme: {theme}
        </div>
      )}
      <div className="mt-4 space-y-4">
        {rows.map((row, playerIdx) => (
          <div key={playerIdx} className="flex flex-col items-center gap-2">
            <input
              type="text"
              className="border p-1 rounded text-center"
              value={playerNames[playerIdx] || ""}
              onChange={(e) => updatePlayerName(playerIdx, e.target.value)}
              placeholder={`Player ${playerIdx + 1} Name`}
            />
            <div className="flex gap-2 justify-center">
              {row.map((tile, tileIdx) => (
                <div
                  key={tileIdx}
                  className={`w-12 h-12 flex items-center justify-center border rounded text-xl font-bold relative ${
                    tile.removed ? "bg-gray-300" : "bg-yellow-200"
                  }`}
                >
                  {tile.letter}
                  <button
                    className={`absolute top-0 right-0 text-white text-xs rounded-full w-5 h-5 ${
                      tile.removed ? "bg-green-500" : "bg-red-500"
                    }`}
                    onClick={() => toggleTile(playerIdx, tileIdx)}
                  >
                    {tile.removed ? "+" : "X"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {rows.length > 0 && (
        <button
          onClick={regenerateTiles}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Regenerate Tiles
        </button>
      )}
    </div>
  );
}
