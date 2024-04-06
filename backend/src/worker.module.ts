
import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { GameState } from './state/state.provider';

@Module({
  imports: [],
  providers: [WorkerService, GameState],
})
export class WorkerModule { }
