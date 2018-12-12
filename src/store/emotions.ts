import weiboAPIRequest from './weibo';
import {Emotion} from '../Types';
import StoreBaseWithPersist from "./StoreBaseWithPersist";

class EmotionStore extends StoreBaseWithPersist {
  private _emotions: Emotion[] = [];
  private _emotionsMap: Map<string, string> = new Map();

  toJSON() {
    return this._emotions;
  }

  protected restoreStateFromJSON(emotions: Emotion[]) {
    this.addEmotions(emotions);
  }

  protected _keyExtractor():string {
    return `emotions_face`;
  }

  addEmotions(emotions: Emotion[]) {
    emotions.forEach((emotion: Emotion) => {
      this._emotionsMap.set(emotion.value, emotion.url);
    });

    this._emotions = emotions;
  }

  public hasLocalStore() {
    return this._emotions.length > 0;
  }

  public getEmotionUrlByValue(value: string) {
    return this._emotionsMap.get(value);
  }

  async fetch() {
    const response = await weiboAPIRequest('/emotions.json', {
      type: 'face'
    });

    if (response.error) {
      return response;
    }

    this.addEmotions(response);

    return response;
  }

  getEmotions() {
    return this._emotions;
  }
}

export default new EmotionStore();