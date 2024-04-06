import { Injectable, Logger } from '@nestjs/common';
import { GameState } from './state/state.provider';

@Injectable()
export class WorkerService {

  constructor(private gameState: GameState) { }

  async start(): Promise<void> {

    setInterval(() => {
      this.update()
    }, 1000)
  }
  update() {
    this.gameState.state.game.currentTime = Date.now()
    this.updateCandles()
  }
  updateCandles() {
    const candles = this.gameState.state.candles;
    candles.forEach((c) => {
      if (!c.burning)
        return
      const time = this.gameState.state.game.currentTime
      const left = c.dueTime - time
      if (left < 0 || time >= c.dropTime) {
        c.burning = false;
        c.percent = 0
        return
      }
      const percent = (c.dueTime - this.gameState.state.game.startTime) / 100
      c.percent = Math.round(left / percent) / 100
    })
  }
}
