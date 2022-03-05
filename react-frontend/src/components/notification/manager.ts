/**
 * @fileoverview Defines Manager class.
 * @copyright Shingo OKAWA 2022
 */
import * as Events from 'events';
import * as Props from './props';
import { uuid } from 'uuidv4';

/** Responsible to create/delete notification events. */
class Manager extends Events.EventEmitter {
  /** @const Holds a queue of notifies. */
  private que: Props.Notify[];

  /** Construcdtor. */
  constructor() {
    super();
    this.que = [] as Props.Notify[];
  }

  /**
   * @param {Partial<Props.Notify>} options
   * @param {Level} level
   */
  create(options: Partial<Props.Notify>, level: Props.Level): void {
    const notify = {
      key: uuid(),
      level: level || Props.Level.INFO,
      title: null,
      message: null,
      ttl: 5000,
    } as Props.Notify;
    this.que.push(Object.assign(notify, options));
    this.emitChange();
  }

  /**
   * @param {string} key
   */
  find(key: string): Props.Notify {
    return this.que.find((n) => key !== n.key);
  }

  /**
   * @param {Props.Notify} notify
   */
  remove(notify: Props.Notify): void {
    this.que = this.que.filter((n) => notify.key !== n.key);
    this.emitChange();
  }

  /**
   * @param
   */
  emitChange(): void {
    this.emit(Props.NotifiedEvent, this.que);
  }

  /**
   * @param {() => void} callback
   */
  addNotificationListener(callback: (notifies: Props.Notify[]) => void): void {
    this.addListener(Props.NotifiedEvent, callback);
  }

  /**
   * @param {() => void} callback
   */
  removeNotificationListener(
    callback: (notifies: Props.Notify[]) => void
  ): void {
    this.removeListener(Props.NotifiedEvent, callback);
  }

  /**
   * @param {string | Partial<Props.Notify>} maybeoptions
   */
  parse(maybeOptions: string | Partial<Props.Notify>): Partial<Props.Notify> {
    if (typeof maybeOptions === 'string') return { message: maybeOptions };
    else return maybeOptions;
  }

  /**
   * @param {string | Partial<Props.Notify>} maybeoptions
   */
  info(maybeOptions: string | Partial<Props.Notify>): void {
    this.create(this.parse(maybeOptions), Props.Level.INFO);
  }

  /**
   * @param {string | Partial<Props.Notify>} maybeoptions
   */
  success(maybeOptions: string | Partial<Props.Notify>): void {
    this.create(this.parse(maybeOptions), Props.Level.SUCCESS);
  }

  /**
   * @param {string | Partial<Props.Notify>} maybeoptions
   */
  warning(maybeOptions: string | Partial<Props.Notify>): void {
    this.create(this.parse(maybeOptions), Props.Level.WARNING);
  }

  /**
   * @param {string | Partial<Props.Notify>} maybeoptions
   */
  error(maybeOptions: string | Partial<Props.Notify>): void {
    this.create(this.parse(maybeOptions), Props.Level.ERROR);
  }

  /**
   * @param {string | Partial<Props.Notify>} maybeoptions
   */
  custom(maybeOptions: string | Partial<Props.Notify>): void {
    this.create(this.parse(maybeOptions), Props.Level.CUSTOM);
  }
}

/** Exports singleton manager. */
export default new Manager();
