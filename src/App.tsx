import "./App.css";
import TopBar from "./TopBar";
import Board from "./Board";
import { useState } from "react";
import { GameState } from "./GameState";
import { TileState } from "./TileState";

function App() {
	const startingState = generateStartingState(8, 8, 10);
	const [game, setGame] = useState(startingState);

	function generateStartingState(rows: number, cols: number, mines: number): GameState {
		const tiles = generateStartingTiles(rows, cols, mines);
		const state: GameState = {
			rows: rows,
			cols: cols,
			mines: mines,
			tiles: tiles,
		};
		return state;
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
		console.log(tile);
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
		console.log(surroundingTiles);
		return surroundingTiles.filter((t): t is TileState => t.hasMine).length;
	}

	function handleTileLeftClick(e: React.MouseEvent<HTMLButtonElement>, row: number, col: number): void {
		e.preventDefault();
		const newGameState: GameState = {
			rows: game.rows,
			cols: game.cols,
			mines: game.mines,
			tiles: game.tiles.slice(),
		};
		const tile: TileState = newGameState.tiles[calculateIndex(row, col, newGameState.cols)];

		if (tile.hasFlag || tile.revealed) return;

		if (!tile.hasMine) revealEmpty(tile, newGameState, true);

		if (tile.hasMine) {
			for (let tile of newGameState.tiles) {
				tile.revealed = true;
			}
		}

		setGame(newGameState);
	}

	function handleTileRightClick(e: React.MouseEvent<HTMLButtonElement>, row: number, col: number): void {
		e.preventDefault();
		const newGameState: GameState = {
			rows: game.rows,
			cols: game.cols,
			mines: game.mines,
			tiles: game.tiles.slice(),
		};
		const tile: TileState = newGameState.tiles[calculateIndex(row, col, newGameState.cols)];

		if (tile.revealed) return;

		tile.hasFlag = !tile.hasFlag;

		setGame(newGameState);
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

	return (
		<div className='game'>
			<TopBar />
			<Board game={game} onTileLeftClick={handleTileLeftClick} onTileRightClick={handleTileRightClick} />
		</div>
	);
}

export default App;
