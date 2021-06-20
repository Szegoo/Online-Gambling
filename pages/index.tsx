import NavBar from '../components/navigation-bar';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { ABI } from '../contract/ABI';
import { useEffect, useState } from 'react';
const web3 = new Web3(Web3.givenProvider);
declare let window: any;

export const contractAddress = "0x002E88Eb18fbCDCeb1D838dA293cd36c5DA82970";
const enableMetamask = async () => {
	const accounts = await window.ethereum.enable();
	const account = accounts[0];
	const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
	const prize = Game.methods.prize().call();
	return prize;
}
const play = async (number) => {
	const accounts = await window.ethereum.enable();
	const account = accounts[0];
	const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
	const value = new BigNumber(Math.pow(10, 16)).toString();
	await Game.methods.join(number).send({
		value
	});
}
export default () => {
	const [counter, setCounter] = useState(0);
	const [prize, setPrize] = useState(0);
	const max = 5;
	useEffect(() => {
		enableMetamask().then(data => {
			setPrize(data);
		})
	}, [prize])
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
					<span>{counter}</span>
					<button onClick={() => {
						if (counter < max) {
							setCounter(counter + 1);
						}
					}}>+</button>
				</div>
				<button onClick={() => play(counter)}>
					Join The Game
				</button>
				<p>Total prize: {(prize * Math.pow(10, -18)).toFixed(2)}ETH</p>
			</main>
		</div>
	)
}