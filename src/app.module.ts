import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { ModbusModule } from './modbus/modbus.module';

@Module({
  imports: [ModbusModule],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
