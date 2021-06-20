import NavBar from '../components/navigation-bar';
import humanizeDuration from 'humanize-duration';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { ABI } from '../contract/ABI';
import { useEffect, useState } from 'react';
const web3 = new Web3(Web3.givenProvider);
declare let window: any;

export const contractAddress = "0x002E88Eb18fbCDCeb1D838dA293cd36c5DA82970";
const enableMetamask = async (): Promise<{ prize: number, razlika: number }> => {
	const accounts = await window.ethereum.enable();
	const account = accounts[0];
	const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
	const prize = await Game.methods.prize().call();
	const endTime = await Game.methods.revealDeadline().call();
	const razlika = endTime - (Date.now() / 1000)
	return {
		prize,
		razlika
	};
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
	const [timer, setTimer] = useState(0);
	const max = 5;
	useEffect(() => {
		enableMetamask().then(data => {
			setPrize(data.prize);
			setTimer(data.razlika);
		});
		setInterval(() => {
			setTimer(prev => prev - 1);
		}, 1000);
	}, []);
	const humanize = (time) => {
		return humanizeDuration(time * 1000);
	}
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
				<h1 className="counter">{humanize(timer.toFixed(0))}</h1>
			</main>
		</div>
	)
}