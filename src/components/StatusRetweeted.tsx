import React from 'react';
import RX from 'reactxp';
import {Status} from '../Types';
import {TouchableOpacity} from 'react-native';
import StatusMedia from './StatusMedia';
import {filterStatus} from '../util/statusUtil';
import { withNavigation } from 'react-navigation';

interface StatusRetweetedProps {
  retweetedStatus: Status;
}

const _styles = {
  retweeted: RX.Styles.createViewStyle({
    marginTop: 10,
    backgroundColor: '#eee',
    padding: 10,
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 6,
  }),
  username: RX.Styles.createTextStyle({
    fontWeight: 'bold',
    marginRight: 5
  }),
};

class StatusRetweeted extends RX.Component<StatusRetweetedProps> {
  public render() {
    const {retweetedStatus} = this.props;

    return (
      <RX.View style={ _styles.retweeted }>
        <TouchableOpacity onPress={this._onPressButton.bind(this, retweetedStatus.idstr)}>
          <RX.Text>
            <RX.Text onPress={this._onUserPress.bind(this, retweetedStatus.user.idstr)}
              style={ _styles.username }>{retweetedStatus.user.name}: </RX.Text>
            {filterStatus(retweetedStatus.text)}
          </RX.Text>
        </TouchableOpacity>
        {
          retweetedStatus.pic_urls && retweetedStatus.pic_urls.length > 0 && 
          <StatusMedia picUrls={retweetedStatus.pic_urls} />
        }
      </RX.View>
    );
  }


  private _onPressButton(id) {
    this.props.navigation.navigate('Details', {
      id
    });
  }

  private _onUserPress(id) {
    this.props.navigation.navigate('User', {
      id
    });
  }

}

export default withNavigation(StatusRetweeted);