import "./Topbar.css";
import { GameState } from "./GameState";
import Stopwatch from "./Stopwatch";

interface TopBarProps {
	game: GameState;
	time: number;
	onReset: () => void;
}

function TopBar({ game, time, onReset }: TopBarProps) {
	const remainingMines = calculateRemainignMines();
	const face: string = game.status === "won" ? "🏆" : game.status === "lost" ? "💀" : "🫎";

	function calculateRemainignMines(): number {
		if (game.status === "won") return 0;
		let flags = game.tiles.filter((t) => t.hasFlag && !t.revealed).length;

		return game.mines - flags;
	}

	return (
		<div className='container'>
			<div className='bar-cell'>{remainingMines}</div>
			<div className='bar-cell'>
				<button className='reset-button' onClick={onReset}>
					{face}
				</button>
			</div>
			<div className='bar-cell'>
				<Stopwatch time={time} />
			</div>
		</div>
	);
}

export default TopBar;
