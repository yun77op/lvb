import React from 'react';
import RX from 'reactxp';
import MentionCommentStore from '../store/mentionComments';
import { ComponentBase } from 'resub';
import CommentComponent from '../components/comment';
import StatusRetweeted from '../components/StatusRetweeted';
import {FlatList} from 'react-native';
import {Comment} from '../Types';
import ErrorComponent from '../components/Error';

const _styles = {
  main: RX.Styles.createViewStyle({
    flex: 1,
  })
};

interface MentionScreenState {
  comments: Comment[];
  refreshing: boolean;
  error: null | string;
}

interface MentionScreenProps {
}

export default class MentionScreen extends ComponentBase<MentionScreenProps, MentionScreenState> {

  protected _buildState(props: MentionScreenProps, initialBuild: boolean): MentionScreenState {
    return {
      comments: MentionCommentStore.getComments(),
      refreshing: false,
      error: initialBuild ? null : this.state.error,
    }
  }

  public render() {
    if (this.state.error) {
      return <ErrorComponent error={this.state.error} />
    }

    return (
      <RX.View style={ _styles.main }>


        <FlatList
          data={this.state.comments}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          onEndReached={this._onEndReached}
          renderItem={this._renderItem.bind(this)}
          onRefresh={this._onRefresh.bind(this)}
          refreshing={this.state.refreshing}
        />

      </RX.View>
    );
  }

  private _onEndReached() {
    MentionCommentStore.fetch(true);
  }

  private async _onRefresh() {
    this.setState(() => {
      return {
        refreshing: true
      }
    }, async () => {
      await MentionCommentStore.fetch();

      this.setState(() => {
        return {
          refreshing: false
        }
      });

    });
  }

  private _keyExtractor = (comment: Comment) => comment.idstr;

  private _renderItem({item}) {
    return (
      <CommentComponent comment={item} onDelete={this._onDelete.bind(this)}>
        <StatusRetweeted retweetedStatus={item.status} />
      </CommentComponent>
    )
  }

  private async _onDelete() {
    const response = await MentionCommentStore.fetch();
    if (response.error) {
      this.setState(() => {
        return {
          error: response.error
        }
      });
    }
  }

  public async componentDidMount() {
    const response = await MentionCommentStore.fetch();
    if (response.error) {
      this.setState(() => {
        return {
          error: response.error
        }
      });
    }
  }
}
