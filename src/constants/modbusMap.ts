export const modbusMapping = {
  currentDC: {
    address: 32017,
    quantity: 1,
    index: 0,
    decimal: 2,
  },
  voltageDC: {
    address: 32016,
    quantity: 1,
    index: 0,
    decimal: 1,
  },
  tempInverter: {
    address: 32087,
    quantity: 1,
    index: 0,
    decimal: 1,
  },
  voltageL1: {
    address: 32069,
    quantity: 1,
    index: 0,
    decimal: 1,
  },
  voltageL2: {
    address: 32070,
    quantity: 1,
    index: 0,
    decimal: 1,
  },
  voltageL3: {
    address: 32071,
    quantity: 1,
    index: 0,
    decimal: 1,
  },
  currentL1: {
    address: 32072,
    quantity: 2,
    index: 1,
    decimal: 3,
  },
  currentL2: {
    address: 32074,
    quantity: 2,
    index: 1,
    decimal: 3,
  },
  currentL3: {
    address: 32076,
    quantity: 2,
    index: 1,
    decimal: 3,
  },
};
