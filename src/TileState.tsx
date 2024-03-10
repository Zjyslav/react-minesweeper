export interface TileState {
	row: number;
	col: number;
	revealed: boolean;
	hasMine: boolean;
	hasFlag: boolean;
	surroundingMines?: number;
}
