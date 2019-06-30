import { NearestScanner } from '@toio/scanner';

// workaround for android. see https://bit.ly/2XE87Z0
if (/android/i.test(navigator.userAgent)) {
  const mutexify = (promiseFn, mutex = Promise.resolve()) => {
    return function(...args) {
      const job = () => promiseFn.apply(this, args);
      return (mutex = mutex.then(job, job));
    };
  };
  const proto = BluetoothRemoteGATTCharacteristic.prototype;
  const mutex = Promise.resolve();
  proto.startNotifications = mutexify(proto.startNotifications, mutex);
  proto.readValue = mutexify(proto.readValue, mutex);
}

let cube = null;

document.getElementById('connect').addEventListener('click', async () => {
  cube = await new NearestScanner().start();
  document.getElementById('address').innerHTML = cube.address;
  document.getElementById('id').innerHTML = cube.id;

  document.body.className = 'cube-connecting';

  await cube.connect();
  cube.on('battery:battery', info => (document.getElementById('battery').innerHTML = info.level));
  cube.on('button:press', info => (document.getElementById('button').innerHTML = info.pressed));
  cube.on('sensor:collision', info => (document.getElementById('collision').innerHTML = info.isCollisionDetected));
  cube.on('id:position-id', info => (document.getElementById('position-id').innerHTML = JSON.stringify(info)));
  cube.on('id:position-id-missed', () => (document.getElementById('position-id').innerHTML = ''));
  cube.on('id:standard-id', info => (document.getElementById('standard-id').innerHTML = JSON.stringify(info)));
  cube.on('id:standard-id-missed', () => (document.getElementById('standard-id').innerHTML = ''));

  document.body.className = 'cube-connected';
});

document.getElementById('getBatteryStatus').addEventListener('click', async () => {
  const e = document.getElementById('battery');
  e.innerHTML = '';
  e.innerHTML = (await cube.getBatteryStatus()).level;
});

document.getElementById('getButtonStatus').addEventListener('click', async () => {
  const e = document.getElementById('button');
  e.innerHTML = '';
  e.innerHTML = (await cube.getButtonStatus()).pressed;
});

document.getElementById('getCollisionStatus').addEventListener('click', async () => {
  const e = document.getElementById('collision');
  e.innerHTML = '';
  e.innerHTML = (await cube.getCollisionStatus()).isCollisionDetected;
});

document.getElementById('getSlopeStatus').addEventListener('click', async () => {
  const e = document.getElementById('slope');
  e.innerHTML = '';
  e.innerHTML = (await cube.getSlopeStatus()).isSloped;
});

document.getElementById('move-forward').addEventListener('touchstart', async () => cube.move(30, 30, 0));
document.getElementById('move-backward').addEventListener('touchstart', async () => cube.move(-30, -30, 0));
document.getElementById('move-left').addEventListener('touchstart', async () => cube.move(-30, 30, 0));
document.getElementById('move-right').addEventListener('touchstart', async () => cube.move(30, -30, 0));
document.getElementById('move').addEventListener('touchstart', async ev => ev.preventDefault());
document.getElementById('move').addEventListener('touchend', async () => cube.stop());
document.getElementById('move').addEventListener('touchend', async ev => ev.preventDefault());

document.getElementById('move-forward').addEventListener('mousedown', async () => cube.move(30, 30, 0));
document.getElementById('move-backward').addEventListener('mousedown', async () => cube.move(-30, -30, 0));
document.getElementById('move-left').addEventListener('mousedown', async () => cube.move(-30, 30, 0));
document.getElementById('move-right').addEventListener('mousedown', async () => cube.move(30, -30, 0));
document.getElementById('move').addEventListener('mouseup', async () => cube.stop());
document.getElementById('move').addEventListener('mouseleave', async () => cube.stop());

document.getElementById('turnOnLight-red').addEventListener('click', () => cube.turnOnLight({ red: 255, durationMs: 0 }));
document.getElementById('turnOnLight-green').addEventListener('click', () => cube.turnOnLight({ green: 255, durationMs: 0 }));
document.getElementById('turnOnLight-blue').addEventListener('click', () => cube.turnOnLight({ blue: 255, durationMs: 0 }));
document.getElementById('turnOffLight').addEventListener('click', () => cube.turnOffLight());

document.getElementById('playPresetSound').addEventListener('click', ev => {
  if (ev.target.dataset.soundId) {
    cube.playPresetSound(ev.target.dataset.soundId);
  }
});
