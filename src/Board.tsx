import "./Board.css";
import Tile from "./Tile";

type BoardProps = {
	rows: number;
	cols: number;
};

function Board({ rows, cols }: BoardProps) {
	// const tileRows = Array(rows).fill(<div className='tile-row'>{Array(cols).fill(<Tile />)}</div>);

	const tileRows: React.ReactElement[] = [];

	for (let r = 0; r < rows; r++) {
		const row: React.ReactElement[] = [];
		for (let c = 0; c < cols; c++) {
			row.push(<Tile key={`${r}:${c}`} />);
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
