import React from 'react';
import RX from 'reactxp';
import MentionStatusStore from '../store/mentionStatuses';
import { ComponentBase } from 'resub';
import StatusComponent from '../components/status';
import {FlatList} from 'react-native';
import {Status} from '../Types';
import ErrorComponent from '../components/Error';

const _styles = {
  main: RX.Styles.createViewStyle({
    flex: 1,
  })
};

interface MentionScreenState {
  statuses: Status[];
  refreshing: boolean;
  error: null | string;
}

interface MentionScreenProps {
}

export default class MentionScreen extends ComponentBase<MentionScreenProps, MentionScreenState> {

  protected _buildState(props: MentionScreenProps, initialBuild: boolean): MentionScreenState {
    return {
      statuses: MentionStatusStore.getStatuses(),
      refreshing: false,
      error: null
    }
  }

  public render() {
    if (this.state.error) {
      return <ErrorComponent error={this.state.error} />
    }

    return (
      <RX.View style={ _styles.main }>


        <FlatList
          data={this.state.statuses}
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

  private _onPress(options) {
    this.props.navigation.navigate('Details', options);
  }

  private _onUserPress(options) {
    this.props.navigation.navigate('User', options);
  }

  private _onEndReached(info: { distanceFromEnd: number }) {
    MentionStatusStore.fetch(true);
  }

  private async _onRefresh() {
    this.setState(() => {
      return {
        refreshing: true
      }
    }, async () => {
      await MentionStatusStore.fetch();

      this.setState(() => {
        return {
          refreshing: false
        }
      });

    });
  }

  private _keyExtractor = (status: Status) => status.idstr;

  private _renderItem({item}) {

    return (
      <StatusComponent
        onUserPress={this._onUserPress.bind(this)}
        onPress={this._onPress.bind(this)} status={item} />
    )
  }

  public async componentDidMount() {
    const response = await MentionStatusStore.fetch();
    if (response.error) {
      this.setState(() => {
        return {
          error: response.error
        }
      });
    }
  }
}
