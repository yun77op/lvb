import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import { User } from '../Types';
import weiboAPIRequest from './weibo';

@AutoSubscribeStore
class FollowersStore extends StoreBase {
  private _users: User[] = [];
  private _cursor: string = '0';
  private _loaded: boolean = false;

  private _addUsers(users: User[]) {
    this._users = this._users.concat(users);

    this.trigger();
  }

  async fetch(options: {
    cursor?: string;
    id: string;
  }) {

    if (this._loaded) {
      return;
    }

    const query = {
      uid: options.id,
      cursor: options.cursor || this._cursor
    };


    const response = await weiboAPIRequest('/friendships/followers.json', {
      query
    });

    if (response.error || response.users.length === 0) {
      return response;
    }

    this._cursor = response.next_cursor;

    if (response.next_cursor === 0) {
      this._loaded = true;
    }

    const users = response.users;

    this._addUsers(users);

    return response;
  }

  @autoSubscribe
  getUsers() {
    return this._users;
  }
}

export default FollowersStore;