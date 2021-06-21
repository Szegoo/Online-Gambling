import NavBar from '../components/navigation-bar';
import humanizeDuration from 'humanize-duration';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { ABI } from '../contract/ABI';
import { useEffect, useState } from 'react';
const web3 = new Web3(Web3.givenProvider);
declare let window: any;

export const contractAddress = "0x487504a4aC37b923a72ebFd30c27ef6DA5A28cB0";
const enableMetamask = async (): Promise<{ prize: number, razlika: number }> => {
	const accounts = await window.ethereum.enable();
	const account = accounts[0];
	const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
	const prize = await Game.methods.prize().call();
	const endTime = await Game.methods.revealDeadline().call();
	const razlika = (endTime - (Date.now() / 1000)) + 10;
	return {
		prize,
		razlika
	};
}
export default () => {
	const trackEvents = async () => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
		Game.events.PlayerJoined({})
			.on('data', event => {
				console.log(event);
				console.log(prize);
				setPrize(prize => prize + 1);
			});
		Game.events.GameEnded({})
			.on('data', event => {
				setWinNum(event.returnValues.luckyNumber);
				checkIsWinner();
				enableMetamask().then(data => {
					setPrize(data.prize);
					setTimer(data.razlika);
				})
			})
	}
	const checkIsWinner = async () => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
		await Game.methods.withdraw().send();
	}
	const play = async (number) => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
		const value = new BigNumber(Math.pow(10, 16)).toString();
		setSent(true);
		await Game.methods.join(number).send({
			value
		});
	}
	const LastWinnerNumber = async (last) => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
		const number = await Game.methods.winnerNumber().call();
		if (last)
			setLastWinNum(number);
		else {
			setWinNum(number);
			const isWinner = await Game.methods.winners(account).call();
			if (isWinner > 0) {
				await Game.methods.withdraw().call();
			}
		}
	}
	const [counter, setCounter] = useState(0);
	const [prize, setPrize] = useState(0);
	const [timer, setTimer] = useState(0);
	const [sent, setSent] = useState(false);
	const [lastWinnerNumber, setLastWinNum] = useState(0);
	const [winnerNumber, setWinNum] = useState(0);
	const max = 5;
	useEffect(() => {
		trackEvents();
		LastWinnerNumber(true);
		enableMetamask().then(data => {
			setPrize(data.prize);
			setTimer(data.razlika);
		});
		setInterval(() => {
			if (timer >= 0)
				setTimer(prev => prev - 1);
			else {
				setTimer(-1);
				if (winnerNumber !== 0)
					LastWinnerNumber(false);
			}
		}, 1000);
	}, []);
	const humanize = (time) => {
		return humanizeDuration(time * 1000);
	}
	const revealNumber = async () => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
		await Game.methods.revealNumber().send();
	}
	return (
		<div>
			<NavBar backgroundColor="#21313b" color="#e09320" />
			<main>
				<h1>Welcome to Crypto-Gambling</h1>
				<h2>Pogodi broj od 0 do 5</h2>
				<div className="number-input">
					<button disabled={sent} onClick={() => {
						if (counter > 0) {
							setCounter(counter - 1);
						}
					}}>-</button>
					<span>{counter}</span>
					<button disabled={sent} onClick={() => {
						if (counter < max) {
							setCounter(counter + 1);
						}
					}}>+</button>
				</div>
				<button onClick={() => play(counter)}>
					Join The Game
				</button>
				<p>Total prize: {(prize * Math.pow(10, -18)).toFixed(2)}ETH</p>
				<h1 className="counter">{timer < 0 ? "0" : humanize(timer.toFixed(0))}</h1>
				<p>Your number: {counter}</p>
				<h3 style={{ color: "white" }}>Winner number: {winnerNumber}</h3>
				<h4 >Last winner number: {lastWinnerNumber}</h4>
				<button onClick={checkIsWinner}>Withdraw</button>
				<hr />
				{timer <= 0 &&
					<div>
						<h1 style={{ color: "white" }}>Reveal the number</h1>
						<button className="reveal-button" onClick={revealNumber}>Reveal</button>
						<p>(Ako metamask izbaci error to znaci da je vec neko drugi pozvao funkciju)</p>
					</div>
				}
			</main>
		</div>
	)
}