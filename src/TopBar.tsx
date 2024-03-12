import "./Topbar.css";
import { GameState } from "./GameState";
import Stopwatch from "./Stopwatch";

interface TopBarProps {
	game: GameState;
	time: number;
}

function TopBar({ game, time }: TopBarProps) {
	const remainingMines = calculateRemainignMines();
	const face: string = game.status === "won" ? "🏆" : game.status === "lost" ? "💀" : "🫎";

	function calculateRemainignMines(): number {
		if (game.status === "won") return 0;
		let flags = game.tiles.filter((t) => t.hasFlag && !t.revealed).length;

		return game.mines - flags;
	}

	return (
		<div className='container'>
			<div>{remainingMines}</div>
			<div>{face}</div>
			<div>
				<Stopwatch time={time} />
			</div>
		</div>
	);
}

export default TopBar;
