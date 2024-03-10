import "./App.css";
import TopBar from "./TopBar";
import Board from "./Board";

function App() {
	return (
		<div className='game'>
			<TopBar />
			<Board rows={10} cols={10} mines={10} />
		</div>
	);
}

export default App;
