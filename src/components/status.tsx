import React from 'react';
import RX from 'reactxp';
import {Status} from '../Types';
import distanceInWords from 'date-fns/distance_in_words'
import zhLocale from 'date-fns/locale/zh_cn';
import {TouchableOpacity} from 'react-native';
import StatusMedia from './StatusMedia';
import StatusRetweeted from './StatusRetweeted';
import Icon from 'react-native-vector-icons/FontAwesome';
import {filterStatus} from '../util/statusUtil';
import { withNavigation } from 'react-navigation';

interface StatusComponentProps {
  status: Status;
}

const _styles = {
  main: RX.Styles.createViewStyle({
    flexDirection: 'row',
    paddingTop: 10,
    marginLeft: 10,
    marginRight: 10,
  }),
  avatar: RX.Styles.createViewStyle({
    width: 40,
    height: 40,
    marginRight: 10,
    flex: 0
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
  footer: RX.Styles.createViewStyle({
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }),
  button: RX.Styles.createViewStyle({
    marginLeft: 5,
    flexDirection: 'row'
  }),
  buttonText: RX.Styles.createTextStyle({
    fontSize: 12,
    color: '#999',
    marginLeft: 2
  }),
};

class StatusComponent extends React.PureComponent<StatusComponentProps> {
  public render() {
    const {status} = this.props;

    const created_at = new Date(status.created_at)
    const dateDistance = distanceInWords(created_at, new Date(), {
      locale: zhLocale
    })

    return (
      <RX.View style={ _styles.main }>
        <TouchableOpacity onPress={this._onUserPress.bind(this, status.user.idstr)}>
          <RX.Image style={ _styles.avatar } source={status.user.avatar_large} />
        </TouchableOpacity>
        <RX.View style={ _styles.content }>
          <RX.View style={ _styles.header }>
            <TouchableOpacity onPress={this._onUserPress.bind(this, status.user.idstr)}>
              <RX.Text style={ _styles.username }>{status.user.name}</RX.Text>
            </TouchableOpacity>
            <RX.Text>{dateDistance}</RX.Text>
          </RX.View>
          <TouchableOpacity onPress={this._onPressButton.bind(this, status.idstr)}>
            {filterStatus(status.text)}
          </TouchableOpacity>
          {
            status.pic_urls && status.pic_urls.length > 0 && 
            <StatusMedia picUrls={status.pic_urls} />
          }

          {
            status.retweeted_status && <StatusRetweeted
              retweetedStatus={status.retweeted_status} />
          }

          <RX.View style={_styles.footer}>
            <RX.View style={_styles.button}>
              <Icon name="commenting" size={12} color="#999" />{status.comments_count > 0 && <RX.Text style={_styles.buttonText}>{status.comments_count}</RX.Text>}</RX.View>
            <RX.View style={_styles.button}>
              <Icon name="retweet" size={12} color="#999" />{status.reposts_count > 0 && <RX.Text style={_styles.buttonText}>{status.reposts_count}</RX.Text>}</RX.View>
          </RX.View>
        </RX.View>
      </RX.View>
    );
  }

  protected _onPressButton(id: string) {
    this.props.navigation.navigate('Details', {
      id
    });
  }

  protected _onUserPress(id: string) {
    this.props.navigation.navigate('User', {
      id
    });
  }
}

export default withNavigation(StatusComponent);