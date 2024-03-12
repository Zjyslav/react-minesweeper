interface StopwatchProps {
	time: number;
}

function Stopwatch({ time }: StopwatchProps) {
	const formattedTime = formatTime();

	function formatTime(): string {
		const seconds = Math.floor(time / 1000) % 60;
		const minutes = Math.floor(time / 1000 / 60);
		return `${minutes}:${seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`;
	}
	return <div>{formattedTime}</div>;
}

export default Stopwatch;
