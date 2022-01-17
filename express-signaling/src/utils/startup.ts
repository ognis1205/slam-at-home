/**
 * @fileoverview Defines startup scripts.
 * @copyright Shingo OKAWA 2022
 */
import Logger from './logger';

/** Defines event handlers. */
const handleEvents = (): void => {
  try {
    process.on('exit', async () => {
      // Placeholder.
    });
    process.on('uncaughtException', async (error: Error) => {
      Logger.error(error);
    });
    process.on('unhandledRejection', async (error: Error) => {
      Logger.error(error);
    });
  } catch (e) {
    throw new Error(`[startup.handleEvents] ${e.message || e}`);
  }
};

/** Starts up asynchronously. */
const setupAsync = async (
  resolve: (value: unknown) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void
) => {
  try {
    handleEvents();
    resolve(null);
  } catch (exception) {
    reject(`[startup] ${exception.message}`);
  }
};

/** Startup singleton. */
export default () =>
  new Promise(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
      setupAsync(resolve, reject);
    }
  );
