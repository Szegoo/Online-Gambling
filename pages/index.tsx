import NavBar from '../components/navigation-bar';
import humanizeDuration from 'humanize-duration';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { ABI } from '../contract/ABI';
import { useEffect, useState } from 'react';
import RevealNumber from '../components/RevealNumber';
import Counter from '../components/Counter';
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
	const [counter, setCounter] = useState(0);
	const [prize, setPrize] = useState(0);
	const [timer, setTimer] = useState(0);
	const [lastWinnerNumber, setLastWinNum] = useState(0);
	const [winnerNumber, setWinNum] = useState(0);
	const [balance, setBalance] = useState(0);
	const max = 5;
	const trackEvents = async () => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
		Game.events.PlayerJoined({})
			.on('data', async (event) => {
				setPrize(prize => prize + 1);
				const prize = await Game.methods.prize().call();
				setPrize(prize);
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
		getOrSet(number);
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
	useEffect(() => {
		trackEvents();
		LastWinnerNumber(true);
		getBalance().then((data) => {
			console.log(data);
		})
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
	const getOrSet = (number: number) => {
		if (number === -1) {
			if (typeof window !== typeof undefined)
				return localStorage.getItem('number');
			else return 0;
		} else {
			if (typeof window !== typeof undefined)
				localStorage.setItem('number', number.toString());
		}
	}
	const getBalance = async (): Promise<number> => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
		const balance = await Game.methods.winners(account).call();
		setBalance(Number(balance));
		return balance
	}
	return (
		<div>
			<NavBar backgroundColor="#21313b" color="#e09320" />
			<main>
				<h1>Welcome to Crypto-Gambling</h1>
				<h2>Pogodi broj od 0 do 5</h2>
				<Counter counter={counter} max={max} setCounter={setCounter} />
				<button onClick={() => play(counter)}>
					Join The Game
				</button>
				<p>Total prize: {(prize * Math.pow(10, -18)).toFixed(2)}ETH</p>
				<h1 className="counter">{timer < 0 ? "0" : humanize(timer.toFixed(0))}</h1>
				<p>Your number: {getOrSet(-1)}</p>
				<h3 style={{ color: "white" }}>Winner number: {winnerNumber}</h3>
				<h4 >Last winner number: {lastWinnerNumber}</h4>
				<p style={{ margin: "0", color: "white" }}>Your balance: {balance * Math.pow(10, -18)}ETH</p>
				<button onClick={checkIsWinner}>Withdraw</button>
				<hr />
				{timer <= 0 &&
					<RevealNumber />
				}
			</main>
		</div>
	)
}