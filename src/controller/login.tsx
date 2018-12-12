import React from 'react';
import RX from 'reactxp';
import TokenStore from '../store/token';
import { ComponentBase } from 'resub';
import {Status} from '../Types';
import * as WeiBo from 'react-native-weibo';
import {Platform} from 'react-native';

const _styles = {
  main: RX.Styles.createViewStyle({
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }),
};

interface LoginScreenState {
  statuses: Status[];
  refreshing: boolean;
}

interface LoginScreenProps {
}

export default class LoginScreen extends ComponentBase<LoginScreenProps, LoginScreenState> {

  public render() {
    return (
      <RX.View style={_styles.main}>
        <RX.Button onPress={this._onOkButtonPress.bind(this)}><RX.Text>wb login</RX.Text></RX.Button>
      </RX.View>
    )
  }

  private async _onOkButtonPress() {

    // const config = {
    //   appKey: '1668210353',
    //   scope: 'all',       
    //   redirectURI: 'https://fanyo.herokuapp.com/lvb',
    // };

    // setTimeout(() => {

    //   const result = { 
    //     accessToken: "2.00PI7V8ByY87OCfa1720b5e0mYU9lC",
    //     expirationDate: 1546023600419,
    //     refreshToken: "2.00PI7V8ByY87OCbcc8648ce5jvBNDD",
    //     userID: "1322582527"
    //   }

    //   TokenStore.addToken(result);
    // }, 2000);
    // return;


    const config = {
      scope: 'all',
      redirectURI: Platform.OS === 'ios' ? 'https://www.sina.com' : 'https://fanyo.herokuapp.com/lvb'
    };

    try {
      const result = await WeiBo.login(config);
      console.log(result);

      TokenStore.addToken(result);
    } catch(err) {
      alert('login fail:'+ err)
    }
  }
}