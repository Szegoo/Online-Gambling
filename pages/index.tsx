import NavBar from '../components/navigation-bar';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
const web3 = new Web3(Web3.givenProvider);
declare let window: any;

const contractAddress = "0xccf9e23dde44Ee341bd0739fd4b40670501ba523";
const enableMetamask = async () => {
	const accounts = await window.ethereum.enable();
	const account = accounts[0];
}
export default () => {
	const [counter, setCounter] = useState(0);
	const max = 5;
	useEffect(() => {
		enableMetamask();
	})
	return (
		<div>
			<NavBar backgroundColor="#21313b" color="#e09320" />
			<main>
				<h1>Welcome to Crypto-Gambling</h1>
				<h2>Pogodi broj od 0 do 5</h2>
				<div className="number-input">
					<button onClick={() => {
						if (counter > 0) {
							setCounter(counter - 1);
						}
					}}>-</button>
					<input value={counter} disabled={true} type="number" />
					<button onClick={() => {
						if (counter < max) {
							setCounter(counter + 1);
						}
					}}>+</button>
				</div>
			</main>
		</div>
	)
}