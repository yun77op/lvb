import React from 'react';
import RX from 'reactxp';
import {Status} from '../Types';
import distanceInWords from 'date-fns/distance_in_words'
import zhLocale from 'date-fns/locale/zh_cn';
import StatusMedia from './StatusMedia';
import StatusRetweeted from './StatusRetweeted';
import {filterStatus} from '../util/statusUtil';
import { withNavigation } from 'react-navigation';

interface StatusComponentProps {
  status: Status;
  style?: RX.Types.ViewStyleRuleSet;
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
  footer: RX.Styles.createTextStyle({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  }),
  buttons: RX.Styles.createTextStyle({
    flexDirection: 'row'
  }),
  button: RX.Styles.createTextStyle({
    marginHorizontal: 10
  }),
};

class StatusDetailComponent extends RX.Component<StatusComponentProps> {
  public render() {
    const {status, style} = this.props;

    const created_at = new Date(status.created_at)
    const dateDistance = distanceInWords(created_at, new Date(), {
      locale: zhLocale
    });

    return (
      <RX.View style={ [_styles.main, style] }>
        <RX.Image style={ _styles.avatar } source={status.user.avatar_large} />
        <RX.View style={ _styles.content }>
          <RX.View style={ _styles.header }>
            <RX.Text style={ _styles.username }>{status.user.name}</RX.Text>
            <RX.Text>{dateDistance}</RX.Text>
          </RX.View>
          {filterStatus(status.text)}

          {
            status.pic_urls.length > 0 && 
            <StatusMedia picUrls={status.pic_urls} />
          }

          {
            status.retweeted_status && <StatusRetweeted
              retweetedStatus={status.retweeted_status} />
          }

          <RX.View style={_styles.footer}>
            <RX.View style={_styles.buttons}>
              <RX.Button style={_styles.button} onPress={this._onPress.bind(this)}><RX.Text>转发 {status.reposts_count}</RX.Text></RX.Button>
              <RX.Button style={_styles.button} onPress={this._onPress.bind(this)}><RX.Text>评论 {status.comments_count}</RX.Text></RX.Button>
            </RX.View>
            <RX.Text>赞 {status.attitudes_count}</RX.Text>
          </RX.View>
        </RX.View>
      </RX.View>
    );
  }

  private async _onPress() {
    const {status} = this.props;

    this.props.navigation.navigate('Tweet', {
      type: 'Comment',
      id: status.idstr
    });
  }
}

export default withNavigation(StatusDetailComponent);