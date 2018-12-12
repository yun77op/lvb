import { StoreBase } from 'resub';

export default class TimelineStore<T> extends StoreBase {
  protected items: T[] = [];
  protected _maxId: string = '0';
  protected _sinceId: string = '0';

  addItems(items: T[]) {
    const commentsFiltered = items;

    this.items = this.items.concat(commentsFiltered);

    const statusesLength = commentsFiltered.length;

    if (statusesLength > 0) {
      this._sinceId = items[statusesLength - 1].idstr;
    }

    this.trigger();
  }
}