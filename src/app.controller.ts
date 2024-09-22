import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ModbusService } from './modbus/modbus.service';
import { modbusMapping } from './constants/modbusMap';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly modbusService: ModbusService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/modbus')
  async getData(@Query() data: { type: string }, @Res() res: Response) {
    console.log('first');
    console.log('data.type', data.type);
    this.modbusService.fetchCurrentValue(
      modbusMapping[data.type].address,
      modbusMapping[data.type].quantity,
      data.type,
      modbusMapping[data.type].index,
      modbusMapping[data.type].decimal,
    );
    return res.status(200).send('OK');
  }
}
