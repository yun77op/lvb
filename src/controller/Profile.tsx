import React from 'react';
import RX from 'reactxp';
import { ComponentBase } from 'resub';
import { User } from '../Types';
import TokenStore from '../store/token';
import UserStore from '../store/user';
import MiniProfile from '../components/MiniProfile';
import MiniUserTimeline from '../components/MiniUserTimeline';

interface ProfileScreenState {
  user: User | undefined;
  userId: string;
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

export default class ProfileScreen extends ComponentBase<{}, ProfileScreenState> {

  protected _buildState(props: {}, initialBuild: boolean): ProfileScreenState {
    const userId = TokenStore.getUserID();

    return {
      user: UserStore.getUserById(userId),
      userId,
    }
  }

  public componentDidMount() {
    const {userId} = this.state;

    UserStore.fetchItem(userId);
  }

  public render() {
    const {userId} = this.state;

    return (
      <RX.ScrollView style={_styles.main}>
        {this.state.user && <MiniProfile 
          user={this.state.user} isLoggedUser={true} />}

        <MiniUserTimeline id={userId} />
      </RX.ScrollView>
    );
  }

}