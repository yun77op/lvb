import weiboAPIRequest from './weibo';
import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import {Status} from '../Types';
import StatusStore from './status';
import {AsyncStorage} from 'react-native';

@AutoSubscribeStore
class HomeStore extends StoreBase {
  private _statuses: Status[] = [];
  private _maxId: string = '';
  private _sinceId: string = '';

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

  async fetch(next?: boolean) {
    const query = !next ? null : {
      max_id: this._sinceId
    }


    let response = {};

    if (!next) {
      const tweets = await AsyncStorage.getItem('Tweets');
      response.statuses = JSON.parse(tweets);
    } else {

      response = await weiboAPIRequest('/statuses/home_timeline.json', {
        query
      });
    }
    


    if (response.error) {
      return response;
    }

    if (response.statuses.length === 0) return;

    const statuses = response.statuses;

    // AsyncStorage.setItem('Tweets', JSON.stringify(statuses));

    let statusesFiltered;

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

export default new HomeStore();