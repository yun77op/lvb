import weiboAPIRequest from './weibo';
import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import {Status} from '../Types';
import StatusStore from './status';

@AutoSubscribeStore
export default class UserTimelineStore extends StoreBase {
  private _statuses: Status[] = [];
  private _maxId: string = '0';
  private _sinceId: string = '0';

  addStatuses(statuses: Status[]) {
    const statusesFiltered = statuses;

    StatusStore.addStatuses(statusesFiltered);

    this._statuses = this._statuses.concat(statusesFiltered);

    const statusesLength = statusesFiltered.length;

    if (statusesLength > 0) {
      this._sinceId = statuses[statusesLength - 1].idstr;
    }

    this.trigger();
  }

  async fetch(options: {
    maxId: string;
    uid: string;
  }) {
    const query = {
      max_id: options.maxId,
      uid: options.uid
    };

    console.log(query);

    const response = await weiboAPIRequest('/statuses/user_timeline.json', {
      query
    });

    if (response.error || response.statuses.length === 0) {
      return response;
    }

    const statuses = response.statuses;
    let statusesFiltered;

    const next = query.max_id !== '0';

    if (!next) {
      this._maxId = statuses[0];

      this._statuses = [];
      statusesFiltered = statuses;
    } else {
      statusesFiltered = response.statuses.slice(1);
    }

    this.addStatuses(statusesFiltered);

    return response;
  }

  @autoSubscribe
  getStatuses() {
    return this._statuses;
  }
  
}