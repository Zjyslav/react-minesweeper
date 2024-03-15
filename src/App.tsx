import "./App.css";
import TopBar from "./TopBar";
import Board from "./Board";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import { useRef } from "react";
import { GameState } from "./GameState";
import { TileState } from "./TileState";
import { Settings } from "./SettingsModal";

interface StopwatchState {
	time: number;
	isActive: boolean;
	intervalId: number;
	startTime: number;
	stopTime: number;
}

function App() {
	const defaults: Settings = { rows: 8, cols: 8, mines: 10 };
	const [settings, setSettings] = useState(defaults);
	const startingState = generateStartingGameState(settings);
	const [game, setGame] = useState(startingState);
	const startingStopwatchState: StopwatchState = generateStartingStopwatchState();
	const [stopwatch, setStopwatch] = useState(startingStopwatchState);
	const settingsDialogRef: React.RefObject<HTMLDialogElement> = useRef(null);

	function generateStartingGameState(settings: Settings): GameState {
		const tiles = generateStartingTiles(settings);
		const state: GameState = {
			rows: settings.rows,
			cols: settings.cols,
			mines: settings.mines,
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

	function generateStartingTiles(settings: Settings): TileState[] {
		const tiles: TileState[] = [];
		let mineIndexes = Array.from(Array(settings.rows * settings.cols).keys())
			.sort(() => 0.5 - Math.random())
			.slice(-settings.mines);
		let i = 0;
		for (let r = 1; r <= settings.rows; r++) {
			for (let c = 1; c <= settings.cols; c++) {
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
			tile.surroundingMines = countSurroundingMines(tile, tiles, settings.rows, settings.cols);
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
		setGame(generateStartingGameState(settings));
		handleStopwatchStop();
		setStopwatch(generateStartingStopwatchState());
	}

	function handleApplySettings(newSettings: Settings): void {
		settings.cols = newSettings.cols;
		settings.rows = newSettings.rows;
		settings.mines = newSettings.mines;
		setSettings(newSettings);
		handleReset();
		settingsDialogRef.current?.close();
	}

	function handleShowSettingsModal(): void {
		settingsDialogRef.current?.showModal();
	}

	return (
		<>
			<SettingsModal onApplySettings={handleApplySettings} defaults={settings} ref={settingsDialogRef} />
			<div className='game-container'>
				<div className='game'>
					<TopBar
						game={game}
						time={stopwatch.time}
						onReset={handleReset}
						onSettingsClick={handleShowSettingsModal}
					/>
					<Board game={game} onTileLeftClick={handleTileLeftClick} onTileRightClick={handleTileRightClick} />
				</div>
			</div>
		</>
	);
}

export default App;
