import { Injectable } from "@nestjs/common";
import { StateContainer, User } from "src/types/base";
import { Socket } from "socket.io"

@Injectable()
export class GameState {
  state: StateContainer
  users: User[]
  findUserBySocket(socket: Socket): User {
    return this.users.find(u => u.sock.id == socket.id)
  }

  findUserByName(name: string): User {
    return this.users.find(u => u.uname == name)
  }

  serializedState() {
    return JSON.stringify(this.state)
  }
}
