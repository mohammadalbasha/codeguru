import { Namespace, Server, Socket } from "socket.io";
import { JWT } from "../modules/auth/utils/jwt";
import { IOEvents } from "./types";
import { ConfigService } from "../modules/common/config/config";

declare global {
  namespace SocketIO {
    interface Socket {
      userPayload: any;
    }
  }
}

declare module "socket.io/dist/socket" {
  interface Socket {
    userPayload: any;
  }
}

class SocketIOController {
  private ioServer: Server;
  static _instance: SocketIOController;

  private map: Map<string, Socket>;

  // private constructor to ensure Singleton
  private constructor() {
    this.map = new Map();
  }

  static instance() {
    if (SocketIOController._instance) return SocketIOController._instance;

    SocketIOController._instance = new SocketIOController();
    return SocketIOController._instance;
  }

  public initialize(httpServer: any) {
    this.ioServer = new Server(httpServer, {
      cors: {
        origin: ConfigService.getFrontendDomainsConfiguration().DOMAIN,
        methods: ["GET", "POST"],
      },
    });
  }

  public ready() {
    return this.ioServer !== null;
  }

  public getIOServer() {
    return this.ioServer;
  }

  public closeServer() {
    this.ioServer?.close();
  }

  public start(): void {
    this.ioServer
      .use(this.authenticateSocket)
      .on("connection", (socket: Socket) => {
        socket.on("disconnect", () => {
          try {
            this.handleDisconnect(socket);
          } catch (error) {
            this.handleError(socket, error);
          }
        });
      });
  }

  private authenticateSocket(socket: Socket, next: any) {
    if (
      socket.handshake?.query?.token ||
      socket.handshake?.headers?.access_token
    ) {
      try {
        const payload = JWT.verify(
          (socket.handshake.query.token ||
            socket.handshake?.headers?.access_token) as string,
          ConfigService.getJwtConfiguration().ACCESS_SECRET
        );
        socket.userPayload = payload;
        next();
      } catch {
        next(new Error("Authentication error"));
      }
      next();
    } else {
      next(new Error("Authentication error"));
    }
  }

  private handleJoinRoom(socket: Socket, roomId: string) {
    socket.join(roomId);
  }

  private handleError(socket: Socket, err: any) {
    socket.emit("error", { message: err.message });
  }

  private handleDisconnect(socket: Socket): void {
    // remove user form online users
    // map.remove
    console.log("disconnect");
  }
}

export default SocketIOController;
