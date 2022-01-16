/**
 * @fileoverview Defines logger class.
 * @copyright Shingo OKAWA 2022
 */
import Chalk from 'chalk';

/** Defines a logger class. */
class Logger {
  /** Type guard of `Error`. */
  private isError = (value: Error | string): value is Error => {
    return value && value instanceof Error;
  };

  /** Returns the error message. */
  private getMessage = (value: Error | string): string => {
    if (this.isError(value)) {
      return value?.message || value.toString();
    } else {
      return value as string;
    }
  };

  /** Logs a given message. */
  public log = (header: string, message = ''): void =>
    console.log(`${header} ${message}`);

  /** Logs info of a given message. */
  public info = (value: Error | string): void =>
    this.log(Chalk.blue('[INFO]'), this.getMessage(value));

  /** Logs success of a given message. */
  public success = (value: Error | string): void =>
    this.log(Chalk.green('[SUCCESS]'), this.getMessage(value));

  /** Logs warn of a given message. */
  public warn = (value: Error | string): void =>
    this.log(Chalk.yellow('[WARN]'), this.getMessage(value));

  /** Logs error of a given message. */
  public error = (value: Error | string): void =>
    this.log(Chalk.red('[ERROR]'), this.getMessage(value));
}

/** Logger singleton. */
export default new Logger();
