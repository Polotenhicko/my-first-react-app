import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(() => {
      this.props.onDeleteTask?.(+error.message);
      return { hasError: true };
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.slotError ? this.props.slotError : <h1>Пиздец</h1>;
    }
    return this.props.children;
  }
}
