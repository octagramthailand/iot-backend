import { Injectable, OnModuleInit } from '@nestjs/common';
import ModbusRTU from 'modbus-serial';
import { ReadRegisterResult } from 'modbus-serial/ModbusRTU';
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
    // await this.setupAutoFetch();
  }

  private async connect() {
    try {
      await this.client.connectRTUBuffered(
        '/dev/tty.usbserial-120',
        this.connectionOptions,
      );
      this.client.setID(1); // Set your slave ID
      console.log('connected');
      await this.setupAutoFetch();
    } catch (error) {
      console.error('Modbus RTU connection error:', error);
    }
  }

  // public async fetchCurrentValue(
  //   address: number,
  //   quantity: number,
  //   type: string,
  //   index: number,
  //   decimal: number,
  // ): Promise<any> {
  //   try {
  //     console.log('start finding', type, ':', address, '=>', quantity);
  //     // console.log(address);
  //     // console.log(quantity);
  //     const data = await this.client.readHoldingRegisters(address, quantity);
  //     // console.log('index', index);
  //     // console.log('decimal', decimal);
  //     console.log(data);
  //     // // return data.data; // Might need to adjust based on how data is returned
  //     await this.eventsGateway.sendToDashboard({
  //       type: type,
  //       value: Number(data.data[index]) / Math.pow(10, decimal),
  //       time: new Date().getTime(),
  //     });
  //     // console.log('first');
  //   } catch (error) {
  //     console.error('Error fetching current value:', error);
  //     throw error;
  //   }
  // }
  public async fetchCurrentValue(
    address: number,
    quantity: number,
    type: string,
    index: number,
    decimal: number,
  ): Promise<any> {
    try {
      console.log('start finding', type, ':', address, '=>', quantity);

      // Create a timeout promise that rejects in 1000 milliseconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), 1000),
      );

      // Attempt to fetch data and race it against the timeout
      const data = (await Promise.race([
        this.client.readHoldingRegisters(address, quantity),
        timeoutPromise,
      ])) as ReadRegisterResult;

      console.log(data);

      await this.eventsGateway.sendToDashboard({
        type: type,
        value: Number(data.data[index]) / Math.pow(10, decimal),
        time: new Date().getTime(),
      });
    } catch (error) {
      console.error('Error fetching current value:', error);
      // throw error;
    }
  }

  private async setupAutoFetch() {
    // // Function to pause execution for a given duration
    // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // while (true) {
    //   for (let key in modbusMapping) {
    //     await this.fetchCurrentValue(
    //       modbusMapping[key].address,
    //       modbusMapping[key].quantity,
    //       key,
    //       modbusMapping[key].index,
    //       modbusMapping[key].decimal,
    //     );
    //     console.log('first');
    //   }
    //   // Wait for 1 second before starting the next cycle
    //   // await sleep(1000);
    // }
    // for (let key in modbusMapping) {
    //   await this.fetchCurrentValue(
    //     modbusMapping[key].address,
    //     modbusMapping[key].quantity,
    //     key,
    //     modbusMapping[key].index,
    //     modbusMapping[key].decimal,
    //   );
    //   console.log('first');
    // }
    // for (let key in modbusMapping) {
    //   await this.fetchCurrentValue(
    //     modbusMapping[key].address,
    //     modbusMapping[key].quantity,
    //     key,
    //     modbusMapping[key].index,
    //     modbusMapping[key].decimal,
    //   );
    // }
    // setInterval(async () => {
    //   for (let key in modbusMapping) {
    //     await this.fetchCurrentValue(
    //       modbusMapping[key].address,
    //       modbusMapping[key].quantity,
    //       key,
    //       modbusMapping[key].index,
    //       modbusMapping[key].decimal,
    //     );
    //   }
    // }, 2000); // 60000 ms = 1 minute
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    for (let key in modbusMapping) {
      // await this.fetchCurrentValue(
      //   modbusMapping[key].address,
      //   modbusMapping[key].quantity,
      //   key,
      //   modbusMapping[key].index,
      //   modbusMapping[key].decimal,
      // );
      this.infinityFetch(key);
      await sleep(100);
    }
  }

  private async infinityFetch(key: string) {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    while (true) {
      console.log('fetching', key);
      await this.fetchCurrentValue(
        modbusMapping[key].address,
        modbusMapping[key].quantity,
        key,
        modbusMapping[key].index,
        modbusMapping[key].decimal,
      );
      // Wait for 1 second before starting the next cycle
      // console.log('first');
      await sleep(1000);
    }
  }
}
