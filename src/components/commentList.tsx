import React from 'react';
import RX from 'reactxp';
import CommentsStore from '../store/comments';
import CommentComponent from './comment';
import {Comment} from '../Types';
import { ComponentBase, StoreBase } from 'resub';
import {FlatList} from 'react-native';
import {InteractionManager} from 'react-native';

interface CommentListComponentProps {
  id: string;
  renderListHeaderComponent: Function;
}

interface CommentListComponentState {
  comments: Comment[];
  loading: boolean;
  initialBuild: boolean;
}

const _styles = {
  main: RX.Styles.createViewStyle({
  }),
};

export default class CommentListComponent extends ComponentBase<CommentListComponentProps, CommentListComponentState> {

  protected _buildState(props: CommentListComponentProps, initialBuild: boolean): CommentListComponentState {
    return {
      comments: CommentsStore.getComments(props.id) || [],
      loading: initialBuild ? true : this.state.loading,
      initialBuild
    }
  }

  public async componentDidMount() {
    StoreBase.pushTriggerBlock();

    await CommentsStore.fetch({
      id: this.props.id,
      maxId: '0'
    });

    InteractionManager.runAfterInteractions(async () => {
      StoreBase.popTriggerBlock();

      this.setState(() => {
        return {
          loading: false
        }
      })
    })
  }

  public render() {
    return (
      <RX.View style={ [_styles.main] }>
        <FlatList
          data={this.state.initialBuild ? [] : this.state.comments}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          onEndReached={this._onEndReached.bind(this)}
          renderItem={this._renderItem.bind(this)}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={this.props.renderListHeaderComponent}
        />
        {this.state.loading && <RX.ActivityIndicator size='small' color='#999' />}
      </RX.View>
    );
  }


  private _onEndReached(info: { distanceFromEnd: number }) {

    let maxId = '0';

    if (this.state.comments.length > 0) {
      maxId = this.state.comments[this.state.comments.length - 1].idstr;
    }

    CommentsStore.fetch({
      id: this.props.id,
      maxId
    });
  }

  private async _onDelete() {
    await CommentsStore.fetch({
      id: this.props.id,
      maxId: '0'
    });
  }

  private _keyExtractor = (status: Status) => status.idstr;

  private _renderItem({item}) {
    return (
      <CommentComponent onDelete={this._onDelete.bind(this)} comment={item} />
    )
  }
}