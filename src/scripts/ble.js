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

    progressItems.push('Getting private uptime characteristic.');
    var characteristic = await service.getCharacteristic('fdcf4a3f-3fed-4ed2-84e6-04bbb9ae04d4');
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handleUptimeNotifications);

    progressItems.push('Getting private signalStrength characteristic.');
    characteristic = await service.getCharacteristic('cc97c20c-5822-4800-ade5-1f661d2133ee');
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handleSignalStrengthNotifications);

    progressItems.push('Getting private freeMemory characteristic.');
    characteristic = await service.getCharacteristic('d2b26bf3-9792-42fc-9e8a-41f6107df04c');
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', handleFreeMemoryNotifications);

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

function handleUptimeNotifications(event) {
  const value = event.target.value.getUint8(0);

  data.uptime = value;
}

function handleSignalStrengthNotifications(event) {
  const value = event.target.value.getUint8(0);

  data.signalStrength = value;
}

function handleFreeMemoryNotifications(event) {
  const value = event.target.value.getInt32(0);

  data.freeMemory = value / 1000.0;
}

export default {
  initBLE: init
}