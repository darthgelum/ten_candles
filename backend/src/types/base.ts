import { Socket } from "socket.io";

export interface Candle {
  id: number,
  burning: boolean,
  percent: number,
  dropTime: number
  dueTime: number
}

export interface Game {
  startTime: number,
  currentTime: number
}

export interface StateContainer {
  candles: Candle[],
  game: Game
}

export interface User {
  uname: string, sock: Socket
}
