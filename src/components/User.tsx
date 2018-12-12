import React from 'react';
import RX from 'reactxp';
import {User} from '../Types';
import { withNavigation } from 'react-navigation';

interface UserComponentProps {
  user: User;
}

const _styles = {
  main: RX.Styles.createViewStyle({
    flexDirection: 'row',
    paddingTop: 10,
    marginLeft: 10,
    marginRight: 10,
  }),
  avatarContainer: RX.Styles.createViewStyle({
    marginRight: 8,
    flex: 0
  }),
  avatar: RX.Styles.createViewStyle({
    width: 30,
    height: 30
  }),
  content: RX.Styles.createViewStyle({
    flex: 1,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderStyle: 'solid'
  }),
  header: RX.Styles.createViewStyle({
    marginBottom: 10,
    flexDirection: 'row',
  }),
  username: RX.Styles.createTextStyle({
    fontWeight: 'bold',
    marginRight: 5
  }),
  description: RX.Styles.createTextStyle({
  }),
};

class UserComponent extends RX.Component<UserComponentProps> {
  public render() {
    const {user} = this.props;

    return (
      <RX.View style={ _styles.main }>
        <RX.View onPress={this._onUserPress.bind(this, user.idstr)} style={_styles.avatarContainer}>
          <RX.Image style={ _styles.avatar } source={user.avatar_large} />
        </RX.View>
        <RX.View style={ _styles.content } >
          <RX.View style={ _styles.header }>
            <RX.Text onPress={this._onUserPress.bind(this, user.idstr)} style={ _styles.username }>{user.name}</RX.Text>
          </RX.View>
          <RX.View style={_styles.description}><RX.Text>{user.description}</RX.Text></RX.View>
        </RX.View>
      </RX.View>
    );
  }

  private _onUserPress(id: string) {
    this.props.navigation.navigate('User', {
      id
    });
  }

}


export default withNavigation(UserComponent);