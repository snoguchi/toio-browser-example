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
