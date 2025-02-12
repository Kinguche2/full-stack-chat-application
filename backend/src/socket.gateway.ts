import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserDocument, Users } from './schema/user.schema';
import { Model } from 'mongoose';

@WebSocketGateway({
  cors: '*',
  origin: 'http://localhost:3000', // Allow all origins (use specific origins for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow methods for the WebSocket handshak
  allowedHeaders: ['Authorization', 'Content-Type'], // Allow custom headers
  credentials: true, // Allow credentials like Authorization headers
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server; // This is the Socket.IO server instance

  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private readonly onlineUsersMap: Record<string, any> = {};
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  // Handle the connection event when a client connectaa
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        throw new Error('Token not provided');
      }

      // Use the AuthService to extract user details
      const user = await this.getUserDetailsFromToken(token);

      if (user != null) this.onlineUsersMap[user?.id.toString()] = client.id;
      const onlineUsers = Object.keys(this.onlineUsersMap);

      this.server.emit('getOnlineUsers', { onlineUsers });
      console.log(onlineUsers);

      // Attach user data to the client object
      client.data.user = user;

      console.log(`Client connected: ${client.id}, User: ${user?.firstName}`);
    } catch (err) {
      console.error(`Connection unauthorized: ${err.message}`);
      client.disconnect(); // Disconnect unauthorized client
    }
  }

  // Handle the disconnection event when a client disconnect
  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const token = client.handshake.auth?.token;
    const user = await this.getUserDetailsFromToken(token);
    delete this.onlineUsersMap[user.id.toString()];
    this.server.emit('getOnlineUsers', Object.keys(this.onlineUsersMap));
  }

  // Listen for an event called 'message' from the clien
  @SubscribeMessage('newMessage')
  handleMessage(@MessageBody() message: string, client: Socket): void {
    const clientId = this.getUsersSocketId(client);

    // Broadcast the message to all client
    this.server.to(clientId).emit('newMessage', { message });
  }

  @SubscribeMessage('getOnlineUsers')
  async getOnlineUsers(client: Socket) {
    const token = client.handshake.auth?.token;
    const userr = await this.getUserDetailsFromToken(token);
    if (userr != null) this.onlineUsersMap[userr?.id.toString()] = client.id;
    const onlineUsers = Object.keys(this.onlineUsersMap);

    this.server.emit('getOnlineUsers', { onlineUsers });
    console.log(onlineUsers);
  }

  private getUserDetailsFromToken = async (
    token: string,
  ): Promise<UserDocument | null> => {
    if (!token) {
      return null;
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwtSecret'),
      });

      if (!decoded || !decoded.id) {
        throw new Error('Invalid token passed');
      }

      const userId = decoded?.id;
      const user = await this.userModel.findById(userId).select('-password');

      return user;
    } catch (err) {
      console.error('Error decoding token or fetching user:', err);
      return null;
    }
  };

  getUsersSocketId = (receiverId) => {
    return this.onlineUsersMap[receiverId];
  };
}
