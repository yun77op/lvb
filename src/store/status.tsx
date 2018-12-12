import weiboAPIRequest from './weibo';
import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import {Status} from '../Types';
import UserStore from './user';

@AutoSubscribeStore
class StatusStore extends StoreBase {
  private _statuses: Map<string, Status> = new Map();

  addStatuses(statuses: Status[]) {
    statuses.forEach((status) => {
      this._addStatus(status);
    })
  }

  async addReply(query: {
    comment: string;
    id: string;
    comment_ori: '1'|'0';
    cid: string;
  }) {

    const response = await weiboAPIRequest('/comments/share.json', {
      query
    });

    return response;
  }

  public addStatus(status: Status) {
    this._addStatus(status);
  }

  private _addStatus(status: Status) {
    this._statuses.set(status.idstr, status);
    UserStore.addUser(status.user);
  }

  public hasStatus(id: string) {
    return this._statuses.has(id);
  }

  async fetchItem(id: string) {
    if (this.hasStatus(id)) {
      return this._statuses.get(id);
    }

    const response = await weiboAPIRequest('/statuses/show.json', {
      query: {
        id
      }
    });

    if (!response.error) {
      this.addStatus(response);
      this.trigger(response.idstr);
    }

    return response;
  }

  @autoSubscribe
  getStatusById(id: string) {
    return this._statuses.get(id);
  }
}

export default new StatusStore();