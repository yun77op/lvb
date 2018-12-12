import React from 'react';
import RX from 'reactxp';
import HomeStore from '../store/home';
import { ComponentBase } from 'resub';
import StatusComponent from '../components/status';
import {FlatList} from 'react-native';
import {Status} from '../Types';
import ErrorComponent from '../components/Error';
import Icon from 'react-native-vector-icons/FontAwesome';

const _styles = {
  main: RX.Styles.createViewStyle({
    flex: 1,
  }),
  tweetButton: RX.Styles.createButtonStyle({
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: '#268bd2',
    position: 'absolute',
    right: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  nodata: RX.Styles.createViewStyle({
    paddingVertical: 30
  }),
};

interface HomeScreenState {
  statuses: Status[];
  loading: boolean;
  refreshing: boolean;
  error: null | string;
  initialBuild: boolean;
}

interface HomeScreenProps {
}

export default class HomeScreen extends ComponentBase<HomeScreenProps, HomeScreenState> {

  constructor(props: HomeScreenProps) {
    super(props);

    this._onEndReached = this._onEndReached.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._renderListEmptyComponent = this._renderListEmptyComponent.bind(this);
  }

  protected _buildState(props: HomeScreenProps, initialBuild: boolean): HomeScreenState {
    return {
      statuses: HomeStore.getStatuses(),
      refreshing: false,
      loading: initialBuild ? false : this.state.loading,
      error: null,
      initialBuild
    }
  }

  public render() {
    if (this.state.error) {
      return <ErrorComponent error={this.state.error} />
    }

    if (this.state.initialBuild) {
      return <RX.ActivityIndicator size='small' color='#999' />
    }

    return (
      <RX.View style={ _styles.main }>
        <FlatList
          ListEmptyComponent={this._renderListEmptyComponent}
          windowSize={11}
          initialNumToRender={10}
          data={this.state.statuses}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          onEndReached={this._onEndReached}
          renderItem={this._renderItem}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
        />

        <RX.Button onPress={this.onTweetButtonClick.bind(this)} style={_styles.tweetButton}><Icon name="magic" size={20} color="#fff" /></RX.Button>
      </RX.View>
    );
  }

  private _renderListEmptyComponent() {
    if (this.state.initialBuild) {
      return null;
    } else {
      return <RX.View style={_styles.nodata}><RX.Text>没有微博</RX.Text></RX.View>
    }
  }

  private onTweetButtonClick(options) {
    this.props.navigation.navigate('Tweet', options);
  }

  private async _onEndReached(info: { distanceFromEnd: number }) {
    if (this.state.loading) {
      return;
    }

    this.setState(() => {
      return {
        loading: true
      }
    });

    await HomeStore.fetch(true);

    this.setState(() => {
      return {
        loading: false
      }
    });

  }

  private async _onRefresh() {
    this.setState(() => {
      return {
        refreshing: true
      }
    }, async () => {
      await HomeStore.fetch();

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
      <StatusComponent status={item}></StatusComponent>
    )
  }

  public async componentDidMount() {
    const response = await HomeStore.fetch();

    if (response && response.error) {
      this.setState(() => {
        return {
          error: response.error
        }
      });
    }
  }


}
