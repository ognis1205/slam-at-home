/**
 * @fileoverview Defines Manager class.
 * @copyright Shingo OKAWA 2022
 */
import * as Events from 'events';
import * as Props from './props';
import uuidv4 from 'uuid/v4';

/** Responsible to create/delete notification events. */
export class Manager extends Events.EventEmitter {
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
      key: uuidv4(),
      level: level || Props.Level.INFO,
      title: null,
      message: null,
      ttl: 5000,
    } as Props.Notify;
    this.que.push(Object.assign(notify, options));
    this.emitChange();
  }

  remove(notify: Props.Notify): void {
    this.que = this.que.filter((n) => notify.key !== n.key);
    this.emitChange();
  }

  emitChange(): void {
    this.emit(Props.NotifiedEvent, this.que);
  }

  addChangeListener(callback: () => void): void {
    this.addListener(Props.NotifiedEvent, callback);
  }

  removeChangeListener(callback: () => void): void {
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
