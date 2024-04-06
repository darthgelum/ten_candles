import { Injectable, Logger } from '@nestjs/common';
import { GameState } from './state/state.provider';
import { Candle, Game, StateContainer, User } from './types/base';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private gameState: GameState) { }

  private generateCandles(time: number) {
    this.gameState.state.candles = []
    for (let i = 0; i < 10; i++) {
      let candle = {} as Candle;
      candle.id = i;
      let dueTime = Math.round(360000 * (4 + Math.random()))
      const forChance = (Math.random() * (8 - 1) + 1)
      const chance = (Math.random() < forChance / 100)
      if (chance) {
        this.logger.warn("Will drop")
        candle.dropTime = time + (dueTime / forChance)
      }
      candle.dueTime = time + dueTime
      candle.burning = true;
      candle.percent = 100;
      this.gameState.state.candles.push(candle)
    }
  }
  restartGame() {
    this.gameState.users = [] as User[]
    this.gameState.state = {} as StateContainer;
    this.gameState.state.game = {} as Game;
    const time = Date.now()
    this.gameState.state.game.startTime = time
    this.generateCandles(time)
  }

  dropCandle() {
    for (let i = 0; i < 10; i++) {
      const c = this.gameState.state.candles[i]

      if (c.burning) {
        c.burning = false;
        c.percent = 0
        break;
      }
    }
  }

  // regUser(name: String, socket: io.so) {
  //
  // }

  onApplicationBootstrap() {
    this.restartGame()
  }
  getHello(): string {

    return 'Hello World!';
  }

}
