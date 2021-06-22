import Web3 from 'web3';
import { ABI } from '../contract/ABI';
import { contractAddress } from '../pages/index';
const web3 = new Web3(Web3.givenProvider);
declare let window: any

export default () => {
	const revealNumber = async () => {
		const accounts = await window.ethereum.enable();
		const account = accounts[0];
		const Game = new web3.eth.Contract(ABI, contractAddress, { from: account });
		await Game.methods.revealNumber().send();
	}
	return (
		<div>
			<h1 style={{ color: "white" }}>Reveal the number</h1>
			<button className="reveal-button" onClick={revealNumber}>Reveal</button>
			<p>(Ako metamask izbaci error to znaci da je vec neko drugi pozvao funkciju)</p>
		</div>
	)
}