const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL] || 1;

function timestamp() {
  return new Date().toISOString();
}

export const logger = {
  debug: (...args) => { if (currentLevel <= 0) console.log(`[${timestamp()}] [DEBUG]`, ...args); },
  info: (...args) => { if (currentLevel <= 1) console.log(`[${timestamp()}] [INFO]`, ...args); },
  warn: (...args) => { if (currentLevel <= 2) console.warn(`[${timestamp()}] [WARN]`, ...args); },
  error: (...args) => { if (currentLevel <= 3) console.error(`[${timestamp()}] [ERROR]`, ...args); },
};

export default logger;
