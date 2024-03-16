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
  handleMessage(client: any, payload: any): void {
    console.log(payload);
    this.sendToDashboard({
      type: 'voltageDC',
      value: payload,
      time: new Date().getTime(),
    });
  }

  sendToDashboard(data: any) {
    this.server.emit('sendToReact', data);
  }
}
