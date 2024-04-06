export interface Candle {
  id: number,
  burning: boolean,
  percent: number,
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
