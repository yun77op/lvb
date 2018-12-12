import React from 'react';
import RX from 'reactxp';
import {User} from '../Types';
import { withNavigation } from 'react-navigation';

interface MiniProfileProps {
  user: User;
  isLoggedUser?: boolean;
}

const _styles = {
  main: RX.Styles.createViewStyle({
  }),
  info: RX.Styles.createViewStyle({
    flexDirection: 'row',
    marginTop: 20,
  }),
  infoBody: RX.Styles.createViewStyle({
    flex: 1
  }),
  avatar: RX.Styles.createViewStyle({
    width: 80,
    height: 80,
    marginRight: 20,
    marginLeft: 20
  }),
  username: RX.Styles.createTextStyle({
    fontWeight: 'bold'
  }),
  description: RX.Styles.createViewStyle({
    marginTop: 10
  }),
  location: RX.Styles.createViewStyle({
    marginTop: 10
  }),
  count: RX.Styles.createViewStyle({
    flexDirection: 'row',
    marginTop: 20
  }),
  countItem: RX.Styles.createViewStyle({
    flex: 1
  }),
  countItemContent: RX.Styles.createTextStyle({
    textAlign: 'center'
  }),
  friendStatus: RX.Styles.createTextStyle({
    color: '#268bd2'
  }),
};

class MiniProfile extends RX.Component<MiniProfileProps> {
  public render() {
    const {user, isLoggedUser} = this.props;

    const friendStatus = user.following ? (
      user.follow_me ? '互相关注' : '已关注'
    ) : '未关注';

    return (
      <RX.View style={ _styles.main }>
        <RX.View style={ _styles.info }>
          <RX.Image style={ _styles.avatar } source={user.avatar_large} />
          <RX.View style={ _styles.infoBody }>
            <RX.Text>
              <RX.Text style={ _styles.username }>{user.name}</RX.Text>
              {!isLoggedUser && <RX.Text style={ _styles.friendStatus }>{friendStatus}</RX.Text>}
            </RX.Text>
            <RX.Text style={ _styles.description }>{user.description}</RX.Text>
            <RX.Text style={ _styles.location }>{user.location}</RX.Text>
          </RX.View>
        </RX.View>
        <RX.View style={ _styles.count }>
          <RX.View style={ _styles.countItem }>
            <RX.Text style={ _styles.countItemContent }>微博</RX.Text>
            <RX.Text style={ _styles.countItemContent }>{user.statuses_count}</RX.Text>
          </RX.View>
          <RX.View style={ _styles.countItem } onPress={this._onFriendsButtonClick.bind(this, user.idstr)}>
            <RX.Text style={ _styles.countItemContent }>关注</RX.Text>
            <RX.Text style={ _styles.countItemContent }>{user.friends_count}</RX.Text>
          </RX.View>
          <RX.View style={ _styles.countItem } onPress={this._onFollowersButtonClick.bind(this, user.idstr)}>
            <RX.Text style={ _styles.countItemContent }>粉丝</RX.Text>
            <RX.Text style={ _styles.countItemContent }>{user.followers_count}</RX.Text>
          </RX.View>
        </RX.View>
      </RX.View>
    );
  }

  private _onFriendsButtonClick(id) {
    this.props.navigation.push('Friends', {
      id
    });
  }


  private _onFollowersButtonClick(id) {
    this.props.navigation.push('Followers', {
      id
    });
  }
}


export default withNavigation(MiniProfile);