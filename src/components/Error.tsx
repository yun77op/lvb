import React, {Component} from 'react';
import RX from 'reactxp';

interface ErrorProps {
  error: string;
}

const _styles = {
  main: RX.Styles.createViewStyle({
    paddingTop: 30,
    paddingBottom: 30,
  }),
  error: RX.Styles.createTextStyle({
    textAlign: 'center',
  }),
};

export default class ErrorComponent extends Component<ErrorProps> {
  public render() {
    return (
      <RX.View style={_styles.main}>
        <RX.Text style={_styles.error}>{this.props.error}</RX.Text>
      </RX.View>
    );
  }
}