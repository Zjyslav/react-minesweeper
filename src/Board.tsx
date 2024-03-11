import "./Board.css";
import Tile from "./Tile";
import { GameState } from "./GameState";

interface BoardProps {
	game: GameState;
	onTileRightClick: (e: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void;
	onTileLeftClick: (e: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void;
}

function Board({ game, onTileLeftClick, onTileRightClick }: BoardProps) {
	const tileRows: React.ReactElement[][] = Array(game.rows)
		.fill(0)
		.map((x) => Array(game.cols));

	for (const tile of game.tiles) {
		tileRows[tile.row - 1][tile.col - 1] = (
			<Tile
				key={`r:${tile.row}-c:${tile.col}`}
				tileState={tile}
				onTileLeftClick={(e) => onTileLeftClick(e, tile.row, tile.col)}
				onTileRightClick={(e) => onTileRightClick(e, tile.row, tile.col)}
			/>
		);
	}
	const tileRowDivs: React.ReactElement[] = [];
	for (let i = 0; i < tileRows.length; i++) {
		tileRowDivs.push(
			<div className='tile-row' key={i + 1}>
				{tileRows[i]}
			</div>
		);
	}

	return <div className='board'>{tileRowDivs}</div>;
}

export default Board;
