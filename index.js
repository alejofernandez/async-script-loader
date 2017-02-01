(function initialize(window, document) {
  function loadScript({ src, globalName, stubType, stubMethods, stub = null }, callback) {
    const script = document.createElement('script');
    const first = document.getElementsByTagName('script')[0];
    const internalStub = stub || createStub(stubType, stubMethods);

    if (internalStub) {
      window[globalName] = internalStub;
    }

    script.async = true;
    script.src = src;
    script.type = 'text/javascript';

    script.onerror = () => {
      const error = `Error loading ${src}`;

      console.debug(error);
      if (internalStub && internalStub._onError) {
        internalStub._onError(error);
      }

      if (callback) {
        callback(error);
      }
    }

    script.onload = () => {
      console.debug(`${src} loaded successfully`);
      if (internalStub && internalStub._onLoad) {
        internalStub._onLoad(window[globalName]);
      }

      if (callback) {
        callback(null, window[globalName]);
      }
    }

    first.parentNode.insertBefore(script, first);
  }

  function createStub(stubType, stubMethods) {
    if (stubType === 'function') {
      return createFunctionStub(stubMethods);
    }

    return null;
  }

  function createFunctionStub(stubMethods) {
    const enqueueCall = (target, method, args) => {
      target._queue = target._queue || [];
      target._queue.push({ method, args });
      return target;
    }

    const stub = (...args) => enqueueCall(stub, null, args);

    (stubMethods || []).forEach((method) => {
      stub[method] = (...args) => enqueueCall(stub, method, args);
    })

    stub._onLoad = (library) => {
      while (stub._queue.length) {
        const call = stub._queue.shift();
        call.method ? library[call.method](...call.args) : library(...call.args);
      }
    };

    return stub;
  }


  const src = 'sample-lib.js';
  loadScript({ src, globalName: 'awesome', stubType: 'function', stubMethods: ['init'] });
  awesome.init('hey');
  awesome(1);
  awesome(2);
  awesome(3);
  awesome(4);

})(window, document);
