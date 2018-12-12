import React from 'react';
import RX from 'reactxp';
import {Comment} from '../Types';
import distanceInWords from 'date-fns/distance_in_words'
import zhLocale from 'date-fns/locale/zh_cn';
import {ActionSheetIOS} from 'react-native';
import { withNavigation } from 'react-navigation';
import {filterStatus} from '../util/statusUtil';
import TokenStore from '../store/token';
import CommentsStore from '../store/comments';

interface CommentComponentProps {
  comment: Comment;
  onDelete: Function
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
};

class CommentComponent extends RX.Component<CommentComponentProps> {
  public render() {
    const {comment, children} = this.props;

    const created_at = new Date(comment.created_at)
    const dateDistance = distanceInWords(created_at, new Date(), {
      locale: zhLocale
    })

    return (
      <RX.View style={ _styles.main }>
        <RX.View onPress={this._onUserPress.bind(this, comment.user.idstr)} style={_styles.avatarContainer}>
          <RX.Image style={ _styles.avatar } source={comment.user.avatar_large} />
        </RX.View>
        <RX.View style={ _styles.content } onPress={this._onItemClick.bind(this)}>
          <RX.View style={ _styles.header }>
            <RX.Text onPress={this._onUserPress.bind(this, comment.user.idstr)} style={ _styles.username }>{comment.user.name}</RX.Text>
            <RX.Text>{dateDistance}</RX.Text>
          </RX.View>
          {filterStatus(comment.text)}
          {children}
        </RX.View>
      </RX.View>
    );
  }

  private _onUserPress(id: string) {
    this.props.navigation.navigate('User', {
      id
    });
  }

  private _onItemClick() {
    const {comment} = this.props;
    const options = ['取消', '回复']

    if (comment.user.idstr === TokenStore.getUserID()) {
      options.push('删除');
    }

    ActionSheetIOS.showActionSheetWithOptions({
      options,
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
    },
    async (buttonIndex) => {
      if (buttonIndex === 1) {
        this.props.navigation.navigate('Tweet', {
          type: 'Reply',
          id: comment.statusId,
          cid: comment.idstr
        });
      } else if (buttonIndex === 2) {
        const response = await CommentsStore.destroy({
          cid: comment.idstr
        });

        if (!response.error) {
          this.props.onDelete();
        }
      }
    });
  }
}


export default withNavigation(CommentComponent);