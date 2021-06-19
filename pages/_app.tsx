import App from 'next/app';
import "../styles/main.scss";

export default class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props;

		return (
			<Component {...pageProps} />
		)
	}
}