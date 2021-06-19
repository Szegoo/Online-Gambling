import { useState, useEffect } from 'react';
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider)
declare let window: any;
const getBalance = async (): Promise<number> => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const balance = await web3.eth.getBalance(account);
    return Number(balance);
}
export default ({ backgroundColor, color }) => {
    const [isOpen, setOpen] = useState(false);
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        getBalance().then((value): void => {
            setBalance(value * Math.pow(10, -18));
        });
    }, [balance])
    const toggleOpen = () => {
        setOpen(currentState => !currentState);
    }
    return (
        <div className="nav">
            <ul className="navigation-bar">
                <h1>Title</h1>
                <li><a href="/">Home</a></li>
                <li><a href="/get-started">Get Started</a></li>
                <li><a href="/donate">{balance.toFixed(2)}ETH</a></li>
                <li className="special"><a href="/about-us">About us</a></li>
            </ul>
            <div className="navigation-bar-mobile">
                <div onClick={toggleOpen} className="navigation-toggle"></div>
                <h1>Title</h1>
                {isOpen &&
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/get-started">Get Started</a></li>
                        <li><a href="/donate">Donate</a></li>
                        <li><a href="/about-us">About us</a></li>
                        <li className="exit-button"><a onClick={toggleOpen}>X</a></li>
                    </ul>
                }
            </div>
            <style>{`
                div {
                    background-color green;
                }
                .navigation-bar {
                    color: ${color || "white"};
                    margin: 0;
                    display: flex;
                    align-items: center;
                        background-color: ${backgroundColor || "#141414"};
                    }
                    .navigation-bar > h1 {
                        color: white;
                    }
                    .navigation-bar > li {
                        list-style-type: none; }
                        .navigation-bar > li > a {
                        display: block;
                        padding: 1em;
                        color: ${color || "white"};
                        text-decoration: none; }
                        .navigation-bar > li > a:hover {
                            color: wheat; }
                    .navigation-bar > .special {
                        margin-left: auto; }
                    @media (max-width: 450px) {
                        .navigation-bar {
                        display: none; } }

                    .navigation-bar-mobile {
                    display: none; }
                    @media (max-width: 450px) {
                        .navigation-bar-mobile {
                        display: block; } }
                    .navigation-bar-mobile > .navigation-toggle {
                        width: fit-content;
                        height: 50px; }
                        .navigation-bar-mobile > .navigation-toggle::after {
                        position: absolute;
                        right: .5em;
                        display: block;
                        color: black;
                        content: "\\2261";
                        font-size: 2.7rem; }
                    .navigation-bar-mobile > ul {
                        animation: move-in .6s linear;
                        position: fixed;
                        top: 0;
                        right: 0;
                        left: 0;
                        margin: 0;
                        list-style-type: none;
                        padding: 0;
                        background-color: ${backgroundColor || "#141414"};
                        .navigation-bar-mobile > ul > li {
                        text-align: center; }
                        .navigation-bar-mobile > ul > li > a {
                            display: block;
                            color: white;
                            text-decoration: none;
                            padding: 1em; }
                        .navigation-bar-mobile > ul .exit-button {
                        font-weight: 200; }
                    .navigation-bar-mobile > h1 {
                        color: black;
                        top: 0;
                        margin: .1em;
                        position: absolute;
                    }

                    @keyframes move-in {
                    0% {
                        transform: translateY(-200px); }
                    100% {
                        transform: translateY(0px); } }
            `}</style>
        </div>
    )
}