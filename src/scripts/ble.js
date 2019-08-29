let data = null;

async function init(vm) {
  data = vm.$data;
  try {
    let progressItems = data.progressItems;

    progressItems.push('Requesting bluetooth device.');
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['5c1b9a0d-b5be-4a40-8f7a-66b36d0a5176'] }]
    });

    progressItems.push('Connecting to GATT server.');
    const server = await device.gatt.connect();

    data.deviceFound = true;

    progressItems.push('Getting private service.');
    const service = await server.getPrimaryService('5c1b9a0d-b5be-4a40-8f7a-66b36d0a5176');

    progressItems.push('Getting private batState characteristic.');
    var characteristic = await service.getCharacteristic('fdcf4a3f-3fed-4ed2-84e6-04bbb9ae04d4');
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handleBatStateNotifications);

    progressItems.push('Getting private powerSource characteristic.');
    characteristic = await service.getCharacteristic('cc97c20c-5822-4800-ade5-1f661d2133ee');
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handlePowerSourceNotifications);

    progressItems.push('Getting private batLevel characteristic.');
    characteristic = await service.getCharacteristic('d2b26bf3-9792-42fc-9e8a-41f6107df04c');
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handleBatLevelNotifications);

    setTimeout(removeItems, 2000);
  } catch (error) {
    data.errorMsg = 'Error: ' + error
  }
}

function removeItems() {
  data.progressItems.shift();
  if (data.progressItems.length > 0) {
    setTimeout(removeItems, 500);
  }
}

function handleBatLevelNotifications(event) {
  const value = event.target.value.getUint8(0);

  data.battLevel = value;
}

function handlePowerSourceNotifications(event) {
  const value = event.target.value.getUint8(0);

  let sourceText;
  switch (value) {
    case 1: // POWER_SOURCE_VIN
      sourceText = 'VIN';
      break;
    case 2: // POWER_SOURCE_USB_HOST
      sourceText = 'USB Host';
      break;
    case 3: // POWER_SOURCE_USB_ADAPTER
      sourceText = 'USB Adapter';
      break;
    case 4: // POWER_SOURCE_USB_OTG
      sourceText = 'USB OTG';
      break;
    case 5: // POWER_SOURCE_BATTERY
      sourceText = 'Battery';
      break;
    case 0: // POWER_SOURCE_UNKNOWN
    default:
      sourceText = 'Unknown';
      break;
  }
  data.powerSource = sourceText;
}

function handleBatStateNotifications(event) {
  const value = event.target.value.getUint8(0);

  let stateText;
  switch (value) {
    case 1: // BATTERY_STATE_NOT_CHARGING
      stateText = 'Not Charging';
      break;
    case 2: // BATTERY_STATE_CHARGING
      stateText = 'Charging';
      break;
    case 3: // BATTERY_STATE_CHARGED
      stateText = 'Charged';
      break;
    case 4: // BATTERY_STATE_DISCHARGING
      stateText = 'Discharging';
      break;
    case 5: // BATTERY_STATE_FAULT
      stateText = 'Fault';
      break;
    case 6: // BATTERY_STATE_DISCONNECTED
      stateText = 'Disconnected';
      break;
    case 0: // BATTERY_STATE_UNKNOWN
    default:
      stateText = 'Unknown';
      break;
  }
  data.battState = stateText;
}

export default {
  initBLE: init
}