import "./Board.css";
import Tile from "./Tile";
import { useState } from "react";
import { TileState } from "./TileState";

type BoardProps = {
	rows: number;
	cols: number;
};

function Board({ rows, cols }: BoardProps) {
	const [tileStates, setTileStates] = useState<TileState[]>(generateStartingState(rows, cols));
	const tileRows: React.ReactElement[] = [];

	function handleTileLeftClick(e: React.MouseEvent<HTMLButtonElement>, row: number, col: number): void {
		e.preventDefault();
		console.log(`left click: ${row}:${col}`);
		const newStates: TileState[] = tileStates.slice();
		const state: TileState = newStates[calculateIndex(row, col, cols)];
		state.displaySymbol = "X";

		const adjacentTiles: TileState[] = [];
		if (row > 1) adjacentTiles.push(newStates[calculateIndex(row - 1, col, cols)]);
		if (row < rows) adjacentTiles.push(newStates[calculateIndex(row + 1, col, cols)]);
		if (col > 1) adjacentTiles.push(newStates[calculateIndex(row, col - 1, cols)]);
		if (col <= cols) adjacentTiles.push(newStates[calculateIndex(row, col + 1, cols)]);

		for (const tile of adjacentTiles) {
			tile.displaySymbol = "X";
		}

		setTileStates(newStates);
	}

	function handleTileRightClick(e: React.MouseEvent<HTMLButtonElement>, row: number, col: number): void {
		e.preventDefault();
		console.log(`right click: ${row}:${col}`);
	}

	function generateStartingState(rows: number, cols: number): TileState[] {
		const states: TileState[] = [];
		for (let r = 1; r <= rows; r++) {
			for (let c = 1; c <= cols; c++) {
				const state: TileState = {
					displaySymbol: `${r}:${c}`,
					row: r,
					col: c,
				};
				states.push(state);
			}
		}
		return states;
	}

	function calculateIndex(row: number, col: number, cols: number): number {
		return (row - 1) * cols + (col - 1);
	}

	let i = 0;
	for (let r = 1; r <= rows; r++) {
		const row: React.ReactElement[] = [];
		for (let c = 1; c <= cols; c++) {
			row.push(
				<Tile
					key={`${r}:${c}`}
					tileState={tileStates[i]}
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
