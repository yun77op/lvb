import StoreBaseWithPersist from "./StoreBaseWithPersist";
import { AutoSubscribeStore, autoSubscribe } from 'resub';

interface TokenState {
  accessToken: string;
  refreshToken: string;
  expirationDate: number;
  userID: string;
}

@AutoSubscribeStore
class TokenStore extends StoreBaseWithPersist {
  private _accessToken: string = '';
  private _refreshToken: string = '';
  private _expirationDate: number = 0;
  private _userID: string = '';

  toJSON() {
    return {
      userID: this._userID,
      accessToken: this._accessToken,
      refreshToken: this._refreshToken,
      expirationDate: this._expirationDate,
    }
  }

  protected restoreStateFromJSON(obj: TokenState) {
    this.addToken(obj);
  }

  protected _keyExtractor():string {
    return `TOKEN`;
  }


  private _addToken(obj: TokenState) {
    this._accessToken = obj.accessToken;
    this._refreshToken = obj.refreshToken;
    this._expirationDate = obj.expirationDate;
    this._userID = obj.userID;
  }

  addToken(obj: TokenState) {
    this._addToken(obj);
    this.trigger();
  }

  @autoSubscribe
  public hasToken() {
    return !!this._accessToken;
  }

  getAccessToken() {
    return this._accessToken;
  }

  getRefreshToken() {
    return this._refreshToken;
  }

  getExpirationDate() {
    return this._expirationDate;
  }

  @autoSubscribe
  getUserID() {
    return this._userID;
  }
}

export default new TokenStore();