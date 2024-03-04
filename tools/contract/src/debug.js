// @jessie-check

let debugInstance = 1;

/**
 * @param {string} name
 * @param {boolean | 'verbose'} enable
 */
export const makeTracer = (name, enable = true) => {
  debugInstance += 1;
  let debugCount = 1;
  const key = `----- ${name}.${debugInstance} `;
  // the cases below define a named variable to provide better debug info
  switch (enable) {
    case false: {
      const logDisabled = (..._args) => {};
      return logDisabled;
    }
    case 'verbose': {
      const infoTick = (optLog, ...args) => {
        if (optLog.log) {
          console.info(key, (debugCount += 1), ...args);
        } else {
          console.info(key, (debugCount += 1), optLog, ...args);
        }
      };
      return infoTick;
    }
    default: {
      const debugTick = (optLog, ...args) => {
        if (optLog.log) {
          optLog.log(key, (debugCount += 1), ...args);
        } else {
          console.info(key, (debugCount += 1), optLog, ...args);
        }
      };
      return debugTick;
    }
  }
};
harden(makeTracer);
