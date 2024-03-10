import "./Tile.css";
import { TileState } from "./TileState";

interface TileProps {
	tileState: TileState;
	onTileLeftClick: (e: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void;
	onTileRightClick: (e: React.MouseEvent<HTMLButtonElement>, row: number, col: number) => void;
}

function Tile({ tileState, onTileLeftClick, onTileRightClick }: TileProps) {
	function getDisplaySymbol(): string {
		if (tileState.hasFlag) return "🚩";
		if (tileState.hasMine && tileState.revealed) return "💣";
		if (!tileState.revealed) return "";
		return String(tileState.surroundingMines);
	}

	const symbol = getDisplaySymbol();

	return (
		<button
			className={"tile " + (tileState.revealed ? "revealed" : "not-revealed")}
			onClick={(e) => onTileLeftClick(e, tileState.row, tileState.col)}
			onContextMenu={(e) => onTileRightClick(e, tileState.row, tileState.col)}
		>
			{symbol}
		</button>
	);
}

export default Tile;
