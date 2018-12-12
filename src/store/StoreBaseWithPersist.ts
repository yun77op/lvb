import { StoreBase } from 'resub';
import {AsyncStorage} from 'react-native';


const store = new Map();

export const getInstanceById = (Store, key: string) => {
  if (store.has(key)) {
    return store.get(key);
  } else {
    const instance = new Store();
    store.set(key, instance);
    return instance;
  }
};


export default class StoreBaseWithPersist extends StoreBase {

  protected _keyExtractor():string {
    return 'key'
  }

  protected restoreStateFromJSON() {}

  constructor(_throttleMs?: number, _bypassTriggerBlocks = false) {
    super(_throttleMs, _bypassTriggerBlocks);

    this.subscribe(this._onStoreChange.bind(this));
  }

  private async _onStoreChange() {
    const json = this.toJSON();
    const key = this._keyExtractor();

    await AsyncStorage.setItem(key, JSON.stringify(json));
  }

  public async restore() {
    const key = this._keyExtractor();
    const item = await AsyncStorage.getItem(key);

    if (item) {
      this.restoreStateFromJSON(JSON.parse(item));
    }
  }
}