import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    console.log(payload);
    await this.sendToDashboard({
      type: 'voltageDC',
      value: payload,
      time: new Date().getTime(),
    });
  }

  async sendToDashboard(data: any) {
    this.server.emit('sendToReact', data);
  }
}
