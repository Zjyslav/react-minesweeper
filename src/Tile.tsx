import "./Tile.css";
import { TileState } from "./TileState";

interface TileProps {
	tileState: TileState;
	onTileLeftClick: (e: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void;
	onTileRightClick: (e: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void;
}

function Tile({ tileState, onTileLeftClick, onTileRightClick }: TileProps) {
	return (
		<button
			className='tile'
			onClick={(e) => onTileLeftClick(e, tileState.row, tileState.col)}
			onContextMenu={(e) => onTileRightClick(e, tileState.row, tileState.col)}
		>
			{tileState.displaySymbol}
		</button>
	);
}

export default Tile;
