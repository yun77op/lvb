import React from 'react';
import RX from 'reactxp';
import FriendsStore from '../store/Friends';
import {getInstanceById} from '../store/StoreBaseWithPersist';
import { ComponentBase } from 'resub';
import UserComponent from '../components/User';
import {FlatList} from 'react-native';
import {User} from '../Types';
import ErrorComponent from '../components/Error';

const _styles = {
  main: RX.Styles.createViewStyle({
    flex: 1,
  })
};

interface FriendsScreenState {
  users: User[];
  refreshing: boolean;
  error: null | string;
}

interface FriendsScreenProps {
}

export default class FriendsScreen extends ComponentBase<FriendsScreenProps, FriendsScreenState> {

  protected _buildState(props: FriendsScreenProps, initialBuild: boolean): FriendsScreenState {

    return {
      users: this.getFriendsStore().getUsers(),
      refreshing: false,
      error: null
    }
  }

  protected getFriendsStore() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id');
    const friendsStore = getInstanceById(FriendsStore, `Friends_${itemId}`);

    return friendsStore;
  }

  public render() {
    if (this.state.error) {
      return <ErrorComponent error={this.state.error} />
    }

    return (
      <RX.View style={ _styles.main }>

        <FlatList
          data={this.state.users}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          onEndReached={this._onEndReached.bind(this)}
          renderItem={this._renderItem.bind(this)}
          onRefresh={this._onRefresh.bind(this)}
          refreshing={this.state.refreshing}
        />

      </RX.View>
    );
  }

  private _onPress(options) {
    this.props.navigation.navigate('Details', options);
  }

  private _onUserPress(options) {
    this.props.navigation.navigate('User', options);
  }

  private _onEndReached(info: { distanceFromEnd: number }) {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id');
    const friendsStore = this.getFriendsStore();

    friendsStore.fetch({
      id: itemId
    });
  }

  private async _onRefresh() {
    this.setState(() => {
      return {
        refreshing: true
      }
    }, async () => {
      await FriendsStore.fetch();

      this.setState(() => {
        return {
          refreshing: false
        }
      });

    });
  }

  private _keyExtractor = (user: User) => user.idstr;

  private _renderItem({item}) {
    return (
      <UserComponent
        onUserPress={this._onUserPress.bind(this)}
        onPress={this._onPress.bind(this)} user={item} />
    )
  }

  public async componentDidMount() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id');
    const friendsStore = this.getFriendsStore();

    const response = await friendsStore.fetch({
      id: itemId,
      cursor: '0'
    });
    if (response && response.error) {
      this.setState(() => {
        return {
          error: response.error
        }
      });
    }
  }
}
