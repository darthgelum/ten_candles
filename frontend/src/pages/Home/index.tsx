import { EffectCallback, useEffect, useState } from 'preact/hooks';
import preactLogo from '../../assets/preact.svg';
import { Candle } from '../../components/Candle';
import './style.css';

import { Socket, io } from "socket.io-client";
import { StateContainer, Candle as CandleContainer } from '../../types/base';
import { startAudioAnalysis } from '../../components/Audio';
import { askName } from '../../components/Reg';
import { RollDice } from '../../components/RollDice';

let ioClient: Socket;
let timeoutClearMsg;

export function getSocket() {
	return ioClient
}
export function Home() {
	const [candles, setCandles] = useState([] as CandleContainer[])
	const [message, setMessage] = useState("")
	useMountEffect(() => {
		let host = window.location.hostname
		ioClient = io(host + ":3000", {
			autoConnect: false,
			transports: ["websocket", "polling"],
		});
		ioClient.connect();
		askName()

		startAudioAnalysis()
		new Promise<void>((resolve) => {
			ioClient.on("connect", () => {
				console.log("connected");
			});

			ioClient.on("admin-get-message", (income: string) => {
				const data = JSON.parse(income) as { message: string }
				setMessage("\t" + data.message)
				clearTimeout(timeoutClearMsg)
				timeoutClearMsg = setTimeout(() => {
					setMessage("")
				}, 6000)
				resolve()
			});

			ioClient.on("pong", (income: string) => {
				const data = JSON.parse(income) as StateContainer
				if (data && data.candles) {
					setCandles([...data?.candles])
				}
				resolve()
			});


		});
		setInterval(() => {
			ioClient.emit("ping", "");
		}, 1000)
	})


	return (
		<div class="parent">
			<div class="text">
				<h1 style="color:white; opacity: 0.1">{message}</h1>
			</div>
			<div class="bg">
				<RollDice sides={6} />
			</div>
			<div class="candles">
				{candles?.map((candle, i) => {
					// Return the element. Also pass key     
					return (<Candle height={100 * candle.percent} />)
				})}
			</div>
		</div>
	);
}

export const useMountEffect = (fun: EffectCallback) => useEffect(fun, [])

