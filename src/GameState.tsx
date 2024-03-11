import { TileState } from "./TileState";

export interface GameState {
  rows: number;
  cols: number;
  mines: number;
  tiles: TileState[];
}
