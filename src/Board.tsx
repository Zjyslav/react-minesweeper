import "./Board.css";
import Tile from "./Tile";
import { useState } from "react";
import { TileState } from "./TileState";

interface BoardProps {
	rows: number;
	cols: number;
	mines: number;
}

function Board({ rows, cols, mines }: BoardProps) {
	const startingState = generateStartingState(rows, cols);
	const [boardState, setboardState] = useState<TileState[]>(startingState);
	const tileRows: React.ReactElement[] = [];

	function handleTileLeftClick(e: React.MouseEvent<HTMLButtonElement>, row: number, col: number): void {
		e.preventDefault();
		const newBoardState: TileState[] = boardState.slice();
		const state: TileState = newBoardState[calculateIndex(row, col, cols)];

		if (state.hasFlag || state.revealed) return;

		if (!state.hasMine) revealEmpty(state, newBoardState, true);

		if (state.hasMine) {
			for (let tile of newBoardState) {
				tile.revealed = true;
			}
		}

		setboardState(newBoardState);
	}

	function handleTileRightClick(e: React.MouseEvent<HTMLButtonElement>, row: number, col: number): void {
		e.preventDefault();
		const newBoardState: TileState[] = boardState.slice();
		const state: TileState = newBoardState[calculateIndex(row, col, cols)];

		if (state.revealed) return;

		state.hasFlag = !state.hasFlag;

		setboardState(newBoardState);
	}

	function generateStartingState(rows: number, cols: number): TileState[] {
		const states: TileState[] = [];
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
				states.push(state);
				i++;
			}
		}

		for (const tile of states) {
			tile.surroundingMines = countSurroundingMines(tile, states);
		}

		return states;
	}

	function calculateIndex(row: number, col: number, cols: number): number {
		return (row - 1) * cols + (col - 1);
	}

	function revealEmpty(tileState: TileState, newBoardState: TileState[], first: boolean): void {
		if (tileState.revealed) return;

		tileState.revealed = true;

		if (!first && tileState.surroundingMines && tileState.surroundingMines > 0) return;

		const adjacentTiles = getSurroundingTiles(tileState, newBoardState);

		for (let tile of adjacentTiles) {
			if (tile && !tile.revealed && !tile.hasMine) revealEmpty(tile, newBoardState, false);
		}
	}

	function getAdjacentTiles(tileState: TileState, newBoardState: TileState[]): TileState[] {
		const adjacentTiles: TileState[] = [];
		if (tileState.row > 1)
			adjacentTiles.push(newBoardState[calculateIndex(tileState.row - 1, tileState.col, cols)]);
		if (tileState.row < rows)
			adjacentTiles.push(newBoardState[calculateIndex(tileState.row + 1, tileState.col, cols)]);
		if (tileState.col > 1)
			adjacentTiles.push(newBoardState[calculateIndex(tileState.row, tileState.col - 1, cols)]);
		if (tileState.col <= cols)
			adjacentTiles.push(newBoardState[calculateIndex(tileState.row, tileState.col + 1, cols)]);
		return adjacentTiles;
	}

	function getSurroundingTiles(tileState: TileState, newBoardState: TileState[]): TileState[] {
		console.log(tileState);
		const surroundingTiles: TileState[] = [];
		if (tileState.row > 1)
			surroundingTiles.push(newBoardState[calculateIndex(tileState.row - 1, tileState.col, cols)]);
		if (tileState.row < rows)
			surroundingTiles.push(newBoardState[calculateIndex(tileState.row + 1, tileState.col, cols)]);
		if (tileState.col > 1)
			surroundingTiles.push(newBoardState[calculateIndex(tileState.row, tileState.col - 1, cols)]);
		if (tileState.col < cols)
			surroundingTiles.push(newBoardState[calculateIndex(tileState.row, tileState.col + 1, cols)]);
		if (tileState.row > 1 && tileState.col > 1)
			surroundingTiles.push(newBoardState[calculateIndex(tileState.row - 1, tileState.col - 1, cols)]);
		if (tileState.row < rows && tileState.col > 1)
			surroundingTiles.push(newBoardState[calculateIndex(tileState.row + 1, tileState.col - 1, cols)]);
		if (tileState.row < rows && tileState.col < cols)
			surroundingTiles.push(newBoardState[calculateIndex(tileState.row + 1, tileState.col + 1, cols)]);
		if (tileState.row > 1 && tileState.col < cols)
			surroundingTiles.push(newBoardState[calculateIndex(tileState.row - 1, tileState.col + 1, cols)]);
		return surroundingTiles;
	}

	function countSurroundingMines(tileState: TileState, newBoardState: TileState[]): number {
		const surroundingTiles = getSurroundingTiles(tileState, newBoardState);
		console.log(surroundingTiles);
		return surroundingTiles.filter((t): t is TileState => t.hasMine).length;
	}

	let i = 0;
	for (let r = 1; r <= rows; r++) {
		const row: React.ReactElement[] = [];
		for (let c = 1; c <= cols; c++) {
			row.push(
				<Tile
					key={`${r}:${c}`}
					tileState={boardState[i]}
					onTileLeftClick={handleTileLeftClick}
					onTileRightClick={handleTileRightClick}
				/>
			);
			i++;
		}
		tileRows.push(
			<div className='tile-row' key={r}>
				{row}
			</div>
		);
	}

	return <div className='board'>{tileRows}</div>;
}

export default Board;
