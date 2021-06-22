export default ({ counter, setCounter, max }) => {
	return (
		<div className="number-input">
			<button onClick={() => {
				if (counter > 0) {
					setCounter(counter - 1);
				}
			}}>-</button>
			<span>{counter}</span>
			<button onClick={() => {
				if (counter < max) {
					setCounter(counter + 1);
				}
			}}>+</button>
		</div>
	)
}