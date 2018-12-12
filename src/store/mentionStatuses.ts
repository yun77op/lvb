import weiboAPIRequest from './weibo';
import { AutoSubscribeStore, autoSubscribe } from 'resub';
import {Status} from '../Types';
import TimelineStore from './Timeline';

@AutoSubscribeStore
class MentionStatusStore extends TimelineStore<Status> {

  async fetch(next?: boolean) {
    const query = !next ? null : {
      max_id: this._sinceId
    }

    const response = await weiboAPIRequest('/statuses/mentions.json', {
      query
    });

    if (response.error) {
      return response;
    }

    if (response.statuses.length === 0) return;

    const statuses = response.statuses;
    let commentsFiltered;

    if (!next) {
      this._maxId = statuses[0];

      this.items = [];
      commentsFiltered = statuses;
    } else {
      commentsFiltered = response.statuses.slice(1);
    }

    this.addItems(commentsFiltered);

    return response;
  }

  @autoSubscribe
  getStatuses() {
    return this.items;
  }
  
}

export default new MentionStatusStore();