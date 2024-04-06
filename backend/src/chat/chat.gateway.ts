import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { AppService } from "src/app.service";
import { GameState } from "src/state/state.provider";

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private gameState: GameState, private gameService: AppService) { }

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log("Initialized");
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.adminUsers(client, "")
    // this.logger.log(`Client id: ${client.id} connected`);
    // this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    const user = this.gameState.findUserBySocket(client)
    this.gameState.users = this.gameState.users.filter(item => item !== user)
    this.adminUsers(client, "")
  }

  @SubscribeMessage("ping")
  ping(client: any, data: any) {
    return {
      event: "pong",
      data: this.gameState.serializedState()
    };
  }

  @SubscribeMessage("admin-restart")
  restart(client: any, data: any) {
    this.gameService.restartGame()
    return {
      event: "pong",
      data: this.gameState.serializedState()
    };
  }
  @SubscribeMessage("admin-users")
  adminUsers(client: any, data: any) {
    let result = this.gameState.users.map(u => u.uname);
    return {
      event: "admin-users-res",
      data: JSON.stringify(result)
    };
  }

  @SubscribeMessage("drop-candle")
  dropCandle(client: any, data: any) {
    this.gameService.dropCandle()
    this.logger.log("toreset");
    return {
      event: "pong",
      data: this.gameState.serializedState()
    };
  }

  @SubscribeMessage("reg")
  reg(client: Socket, data: any) {
    const req = JSON.parse(data)
    this.gameState.users.push({ uname: req.name, sock: client })
    return {
      event: "pong",
      data: this.gameState.serializedState()
    };
  }

  @SubscribeMessage("roll")
  roll(client: Socket, data: any) {
    client.broadcast.emit("roll", data)
    client.emit("roll", data)
  }

  @SubscribeMessage("admin-send-message")
  admSendMsg(client: Socket, data: any) {
    const req = JSON.parse(data) as { message: string }
    const msgArr = req.message.split(" ")
    let first = msgArr.shift()
    let resp = msgArr.toString()

    if (first.trim() == "[All]") {
      client.emit("admin-get-message", JSON.stringify({ message: resp }));
      client.broadcast.emit("admin-get-message", JSON.stringify({ message: resp }))
    } else {
      this.gameState.findUserByName(first.trim()).sock.emit("admin-get-message", JSON.stringify({ message: resp }))
    }
  }
}
