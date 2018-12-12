import React from 'react';
import FriendsScreen from './Friends';
import {getInstanceById} from '../store/StoreBaseWithPersist';
import FollowersStore from '../store/Followers';

export default class FollowersScreen extends FriendsScreen {
  protected getFriendsStore() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id');
    const friendsStore = getInstanceById(FollowersStore, `Followers_${itemId}`);

    return friendsStore;
  }
}