import React from 'react';
import RX from 'reactxp';
import { ComponentBase } from 'resub';
import { Status } from '../Types';
import StatusStore from '../store/status';
import StatusDetail from './statusDetail';
import ErrorComponent from '../components/Error';
import { withNavigation } from 'react-navigation';

interface StatusDetailsState {
  status: Status | undefined;
  error: null | string;
  loading: boolean;
}

interface StatusDetailsProps {
  id: string;
}

class StatusDetailsContainer extends ComponentBase<StatusDetailsProps, StatusDetailsState> {

  protected _buildState(props: StatusDetailsProps, initialBuild: boolean): StatusDetailsState {
    const { id } = props;

    return {
      status: StatusStore.getStatusById(id),
      error: initialBuild ? null : this.state.error,
      loading: initialBuild ? true : this.state.loading
    }
  }

  public async componentDidMount() {
    const { id } = this.props;

    const item = await StatusStore.fetchItem(id);

    if (item.error) {
      this.setState(() => {
        return {
          error: item.error,
          loading: false
        }
      })
    } else {
      this.setState(() => {
        return {
          loading: false
        }
      })
    }
  }

  public render() {
    if (this.state.loading) {
      return <RX.ActivityIndicator size='small' color='#999' />;
    }

    if (this.state.error) {
      return <ErrorComponent error={this.state.error} />
    }

    return (
      <RX.View>
        {this.state.status && <StatusDetail status={this.state.status}
         />}
      </RX.View>
    );
  }

}

export default withNavigation(StatusDetailsContainer);