import { Module } from '@nestjs/common';
import { ModbusService } from './modbus.service';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  imports: [],
  providers: [ModbusService, EventsGateway],
  exports: [ModbusService],
})
export class ModbusModule {}
