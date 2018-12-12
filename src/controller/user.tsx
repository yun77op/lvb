import React from 'react';
import RX from 'reactxp';
import { ComponentBase } from 'resub';
import { User } from '../Types';
import UserStore from '../store/user';
import MiniProfile from '../components/MiniProfile';
import MiniUserTimeline from '../components/MiniUserTimeline';

interface UserScreenState {
  user: User | undefined;
}

const _styles = {
  main: RX.Styles.createViewStyle({
    flex: 1,
  }),
  tip: RX.Styles.createTextStyle({
    textAlign: 'center',
    marginTop: 40
  }),
};

export default class UserScreen extends ComponentBase<{}, UserScreenState> {

  protected _buildState(props: {}, initialBuild: boolean): UserScreenState {
    const { navigation } = props;
    const itemId = navigation.getParam('id');

    return {
      user: UserStore.getUserById(itemId)
    }
  }

  public componentDidMount() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id');

    UserStore.fetchItem(itemId);
  }

  public render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id');

    console.log(this.state.user);

    return (
      <RX.ScrollView style={_styles.main}>
        {this.state.user && <MiniProfile 
          user={this.state.user} />}

        <MiniUserTimeline id={itemId} />
      </RX.ScrollView>
    );
  }

  private async _onFavPress() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id');

  }
}