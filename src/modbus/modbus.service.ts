import { Injectable, OnModuleInit } from '@nestjs/common';
import ModbusRTU from 'modbus-serial';
import { modbusMapping } from 'src/constants/modbusMap';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class ModbusService implements OnModuleInit {
  private client = new ModbusRTU();
  private readonly connectionOptions = {
    baudRate: 9600, // Adjust based on your device's requirements
    dataBits: 8,
    stopBits: 1,
    parity: 'none' as 'none' | 'even' | 'mark' | 'odd' | 'space',
    // You might need to adjust these settings according to your device's specifications
  };

  constructor(private readonly eventsGateway: EventsGateway) {
    this.connect();
  }

  async onModuleInit() {
    await this.setupAutoFetch();
  }

  private async connect() {
    try {
      await this.client.connectRTUBuffered(
        '/dev/tty.usbserial-1320',
        this.connectionOptions,
      );
      this.client.setID(1); // Set your slave ID
      console.log('connected');
    } catch (error) {
      console.error('Modbus RTU connection error:', error);
    }
  }

  public async fetchCurrentValue(
    address: number,
    quantity: number,
    type: string,
    index: number,
    decimal: number,
  ): Promise<any> {
    try {
      console.log('start finding', type, ':', address, '=>', quantity);
      // console.log(address);
      // console.log(quantity);
      const data = await this.client.readHoldingRegisters(address, quantity);
      // console.log('index', index);
      // console.log('decimal', decimal);
      console.log(data);
      // // return data.data; // Might need to adjust based on how data is returned
      await this.eventsGateway.sendToDashboard({
        type: type,
        value: Number(data.data[index]) / Math.pow(10, decimal),
        time: new Date().getTime(),
      });
      // console.log('first');
    } catch (error) {
      console.error('Error fetching current value:', error);
      throw error;
    }
  }

  private async setupAutoFetch() {
    setInterval(async () => {
      for (let key in modbusMapping) {
        await this.fetchCurrentValue(
          modbusMapping[key].address,
          modbusMapping[key].quantity,
          key,
          modbusMapping[key].index,
          modbusMapping[key].decimal,
        );
      }

      // await this.fetchCurrentValue(32070, 1, 'string');
      // await this.fetchCurrentValue(30070, 1, 'model id');
      // await this.fetchCurrentValue(32016, 1, 'voltageDC');
      // await this.fetchCurrentValue(32017, 1, 'currentDC');
      // await this.fetchCurrentValue(32087, 1, 'tempInverter');
      // await this.fetchCurrentValue(32069, 1, 'voltageL1');
      // await this.fetchCurrentValue(32072, 2, 'currentL1');
      // await this.fetchCurrentValue(32070, 1, 'voltageL2');
      // await this.fetchCurrentValue(32074, 2, 'currentL2');
      // await this.fetchCurrentValue(32071, 1, 'voltageL3');
      // await this.fetchCurrentValue(32076, 2, 'currentL3');
    }, 2000); // 60000 ms = 1 minute
  }
}
