import React from 'react';
import RX from 'reactxp';
import { ComponentBase } from 'resub';
import StatusDetailContainer from '../components/StatusDetailContainer';
import ErrorBoundary from '../components/ErrorBoundary';
import CommentList from '../components/commentList';
import {Dimensions} from 'react-native';

interface DetailsScreenState {
}


const {width} = Dimensions.get('window');

const _styles = {
  main: RX.Styles.createViewStyle({
    flex: 1,
    width,
  }),
};

export default class DetailsScreen extends ComponentBase<{}, DetailsScreenState> {

  public render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id');

    return (
      <RX.View style={_styles.main}>
        {<CommentList id={itemId} renderListHeaderComponent={this._renderListHeaderComponent.bind(this)} />}
      </RX.View>
    );
  }

  private _renderListHeaderComponent() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('id');

    return (
      <ErrorBoundary>
        <StatusDetailContainer id={itemId} />
      </ErrorBoundary>
    )
  }
}