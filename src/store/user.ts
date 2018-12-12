import weiboAPIRequest from './weibo';
import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import {User} from '../Types';

@AutoSubscribeStore
class UserStore extends StoreBase {
  private _users: Map<string, User> = new Map();

  addUsers(users: User[]) {
    users.forEach((user) => {
      this._addUser(user);
    })
  }

  public addUser(user: User) {
    this._addUser(user);
  }

  private _addUser(user: User) {
    this._users.set(user.idstr, user);
  }

  public hasUser(id: string) {
    return this._users.has(id);
  }

  async fetchItem(id: string) {
    if (this._users.get(id)) {
      return;
    }

    const response = await weiboAPIRequest('/users/show.json', {
      query: {
        uid: id
      }
    });

    this.addUser(response);
    this.trigger(response.idstr);
  }

  @autoSubscribe
  getUserById(id: string) {
    return this._users.get(id);
  }
}

export default new UserStore();