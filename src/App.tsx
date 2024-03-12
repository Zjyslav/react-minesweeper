import "./App.css";
import TopBar from "./TopBar";
import Board from "./Board";
import { useState } from "react";
import { GameState } from "./GameState";
import { TileState } from "./TileState";

interface StopwatchState {
	time: number;
	isActive: boolean;
	intervalId: number;
	startTime: number;
	stopTime: number;
}

function App() {
	const rows = 16;
	const cols = 30;
	const mines = 99;
	const startingState = generateStartingGameState(rows, cols, mines);
	const [game, setGame] = useState(startingState);
	const startingStopwatchState: StopwatchState = generateStartingStopwatchState();
	const [stopwatch, setStopwatch] = useState(startingStopwatchState);

	function generateStartingGameState(rows: number, cols: number, mines: number): GameState {
		const tiles = generateStartingTiles(rows, cols, mines);
		const state: GameState = {
			rows: rows,
			cols: cols,
			mines: mines,
			tiles: tiles,
			status: "not over",
		};
		return state;
	}

	function generateStartingStopwatchState(): StopwatchState {
		return {
			time: 0,
			isActive: false,
			intervalId: 0,
			startTime: 0,
			stopTime: 0,
		};
	}

	function generateStartingTiles(rows: number, cols: number, mines: number): TileState[] {
		const tiles: TileState[] = [];
		let mineIndexes = Array.from(Array(rows * cols).keys())
			.sort(() => 0.5 - Math.random())
			.slice(-mines);
		let i = 0;
		for (let r = 1; r <= rows; r++) {
			for (let c = 1; c <= cols; c++) {
				const state: TileState = {
					row: r,
					col: c,
					revealed: false,
					hasMine: mineIndexes.includes(i),
					hasFlag: false,
				};
				tiles.push(state);
				i++;
			}
		}
		for (const tile of tiles) {
			tile.surroundingMines = countSurroundingMines(tile, tiles, rows, cols);
		}
		return tiles;
	}

	function calculateIndex(row: number, col: number, cols: number): number {
		return (row - 1) * cols + (col - 1);
	}

	function getSurroundingTiles(tile: TileState, tiles: TileState[], rows: number, cols: number): TileState[] {
		const surroundingTiles: TileState[] = [];
		if (tile.row > 1) surroundingTiles.push(tiles[calculateIndex(tile.row - 1, tile.col, cols)]);
		if (tile.row < rows) surroundingTiles.push(tiles[calculateIndex(tile.row + 1, tile.col, cols)]);
		if (tile.col > 1) surroundingTiles.push(tiles[calculateIndex(tile.row, tile.col - 1, cols)]);
		if (tile.col < cols) surroundingTiles.push(tiles[calculateIndex(tile.row, tile.col + 1, cols)]);
		if (tile.row > 1 && tile.col > 1)
			surroundingTiles.push(tiles[calculateIndex(tile.row - 1, tile.col - 1, cols)]);
		if (tile.row < rows && tile.col > 1)
			surroundingTiles.push(tiles[calculateIndex(tile.row + 1, tile.col - 1, cols)]);
		if (tile.row < rows && tile.col < cols)
			surroundingTiles.push(tiles[calculateIndex(tile.row + 1, tile.col + 1, cols)]);
		if (tile.row > 1 && tile.col < cols)
			surroundingTiles.push(tiles[calculateIndex(tile.row - 1, tile.col + 1, cols)]);
		return surroundingTiles;
	}

	function countSurroundingMines(tile: TileState, tiles: TileState[], rows: number, cols: number): number {
		const surroundingTiles = getSurroundingTiles(tile, tiles, rows, cols);
		return surroundingTiles.filter((t): t is TileState => t.hasMine).length;
	}

	function handleTileLeftClick(e: React.MouseEvent<HTMLButtonElement>, row: number, col: number): void {
		e.preventDefault();
		if (game.status !== "not over") return;
		if (!stopwatch.isActive) handleStopwatchStart();

		const newGameState: GameState = {
			...game,
			tiles: game.tiles.slice(),
		};
		const tile: TileState = newGameState.tiles[calculateIndex(row, col, newGameState.cols)];

		if (tile.hasFlag || tile.revealed) return;

		if (!tile.hasMine) revealEmpty(tile, newGameState, true);

		if (tile.hasMine) {
			handleGameLost(newGameState);
		}

		if (newGameState.tiles.filter((t) => !t.revealed).length === newGameState.mines) handleGameWon(newGameState);

		setGame(newGameState);
	}

	function handleTileRightClick(e: React.MouseEvent<HTMLButtonElement>, row: number, col: number): void {
		e.preventDefault();
		if (game.status !== "not over") return;

		const newGameState: GameState = {
			...game,
			tiles: game.tiles.slice(),
		};
		const tile: TileState = newGameState.tiles[calculateIndex(row, col, newGameState.cols)];

		if (tile.revealed) return;

		tile.hasFlag = !tile.hasFlag;

		setGame(newGameState);
	}

	function handleGameLost(state: GameState) {
		handleStopwatchStop();
		for (let tile of state.tiles) {
			tile.revealed = true;
		}
		state.status = "lost";
	}

	function handleGameWon(state: GameState) {
		handleStopwatchStop();
		state.status = "won";
	}

	function revealEmpty(tile: TileState, gameState: GameState, first: boolean): void {
		if (tile.revealed) return;

		tile.revealed = true;

		if (!first && tile.surroundingMines && tile.surroundingMines > 0) return;

		const surroundingTiles = getSurroundingTiles(tile, gameState.tiles, gameState.rows, gameState.cols);

		for (let tile of surroundingTiles) {
			if (tile && !tile.revealed && !tile.hasMine) revealEmpty(tile, gameState, false);
		}
	}

	function handleStopwatchStart(): void {
		if (stopwatch.isActive) return;
		const state: StopwatchState = {
			time: 0,
			isActive: true,
			intervalId: 0,
			startTime: Date.now(),
			stopTime: 0,
		};
		let id = setInterval(() => {
			const elapsedMs = Date.now() - state.startTime;
			state.time = elapsedMs;
			state.intervalId = id;
			setStopwatch({ ...state, time: elapsedMs, intervalId: id });
		}, 100);
		stopwatch.intervalId = id;
		stopwatch.startTime = state.startTime;
	}

	function handleStopwatchStop(): void {
		if (!stopwatch.isActive) return;
		const state: StopwatchState = {
			...stopwatch,
			isActive: false,
			stopTime: Date.now(),
		};
		clearInterval(state.intervalId);
		state.time = state.stopTime - state.startTime;
		setStopwatch(state);
	}

	function handleReset(): void {
		setGame(generateStartingGameState(rows, cols, mines));
		handleStopwatchStop();
		setStopwatch(generateStartingStopwatchState());
	}

	return (
		<div className='game-container'>
			<div className='game'>
				<TopBar game={game} time={stopwatch.time} onReset={handleReset} />
				<Board game={game} onTileLeftClick={handleTileLeftClick} onTileRightClick={handleTileRightClick} />
			</div>
		</div>
	);
}

export default App;
