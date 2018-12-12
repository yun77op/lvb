import React, {Component} from 'react';
import RX from 'reactxp';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  public componentDidCatch(error, info) {
    this.setState({ error });
  }

  public render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <RX.View><RX.Text>{this.state.error.message}</RX.Text></RX.View>;
    }
    return this.props.children;
  }
}