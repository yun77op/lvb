import React from 'react';
import RX from 'reactxp';
import {Status} from '../Types';
import UserTimeline from '../store/userTimeline';
import {getInstanceById} from '../store/StoreBaseWithPersist';
import { ComponentBase } from 'resub';
import {FlatList} from 'react-native';
import ErrorComponent from '../components/Error';
import StatusComponent from '../components/status';

interface MiniUserTimelineProps {
  id: string;
}

interface MiniUserTimelineState {
  statuses: Status[],
  error: null | string
}

const _styles = {
  main: RX.Styles.createViewStyle({
  }),
};

export default class MiniUserTimeline extends ComponentBase<MiniUserTimelineProps, MiniUserTimelineState> {

  protected _buildState(props: MiniUserTimelineProps, initialBuild: boolean): MiniUserTimelineState {
    const userTimeline = this._getUserTimelineStore();

    return {
      statuses: userTimeline.getStatuses(),
      error: initialBuild ? null : this.state.error
    }
  }


  private _getUserTimelineStore() {
    const id = this.props.id;
    const userTimelineStore = getInstanceById(UserTimeline, `UserTimeline_${id}`);

    return userTimelineStore;
  }

  public async componentDidMount() {
    const userTimeline = this._getUserTimelineStore();
    const response = await userTimeline.fetch({
      maxId: '0',
      uid: this.props.id
    });

    if (response.error) {
      this.setState(() => {
        return {
          error: response.error
        }
      })
    } else if (response.statuses.length === 0) {
      this.setState(() => {
        return {
          error: '微博列表为空'
        }
      })
    }
  }

  public render() {
    if (this.state.error) {
      return <ErrorComponent error={this.state.error} />
    }

    if (!this.state.statuses) {
      return <RX.View style={ _styles.main }><RX.Text>Loading...</RX.Text></RX.View>;
    }

    const statuses = this.state.statuses.slice(0, 20);

    return (
      <RX.View style={ _styles.main }>

        <FlatList
          data={statuses}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem.bind(this)}
        />
      </RX.View>
    );
  }

  private _keyExtractor = (status: Status) => status.idstr;

  private _renderItem({item}) {
    return (
      <StatusComponent status={item} />
    )
  }

}